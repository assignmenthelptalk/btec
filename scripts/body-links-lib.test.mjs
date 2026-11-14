import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countBodyLinks, MAX_BODY_LINKS } from './body-links-lib.mjs';

const page = (inner) =>
  `<html><body><header><nav><a href="/menu-a/">A</a></nav></header><main>${inner}</main>` +
  `<footer><a href="/footer-a/">F</a></footer></body></html>`;

test('the limit is 4', () => {
  assert.equal(MAX_BODY_LINKS, 4);
});

test('counts internal links inside main and ignores header, nav and footer', () => {
  const html = page('<p><a href="/one/">1</a> <a href="/two/">2</a></p>');
  assert.deepEqual(countBodyLinks(html, '/x/'), ['/one/', '/two/']);
});

test('ignores links inside an aside within main', () => {
  const html = page('<a href="/one/">1</a><aside><a href="/side/">S</a></aside><a href="/two/">2</a>');
  assert.deepEqual(countBodyLinks(html, '/x/'), ['/one/', '/two/']);
});

test('counts a repeated target once', () => {
  const html = page('<a href="/one/">1</a><a href="/one/">again</a><a href="/one">no slash</a>');
  assert.deepEqual(countBodyLinks(html, '/x/'), ['/one/']);
});

test('ignores the page itself, anchors, mailto, tel, WhatsApp and external links', () => {
  const html = page(
    '<a href="/x/">self</a><a href="#top">anchor</a><a href="/x/#faq">self anchor</a>' +
      '<a href="mailto:a@b.co">m</a><a href="tel:123">t</a>' +
      '<a href="https://wa.me/447000000000">w</a><a href="https://qualifications.pearson.com/en/a.html">p</a>' +
      '<a href="/real/">real</a>'
  );
  assert.deepEqual(countBodyLinks(html, '/x/'), ['/real/']);
});

test('treats the www and bare site host as internal and resolves relative paths', () => {
  const html = page(
    '<a href="https://www.btecassignment.help/one/">1</a>' +
      '<a href="https://btecassignment.help/two/">2</a><a href="three/">3</a>'
  );
  assert.deepEqual(countBodyLinks(html, '/x/'), ['/two/', '/one/', '/x/three/'].sort());
});

test('ignores links to files such as images and PDFs', () => {
  const html = page('<a href="/images/a.webp">img</a><a href="/doc.pdf">pdf</a><a href="/real/">r</a>');
  assert.deepEqual(countBodyLinks(html, '/x/'), ['/real/']);
});

test('ignores links inside scripts and comments', () => {
  const html = page('<script>var s = \'<a href="/script/">s</a>\';</script><!-- <a href="/c/">c</a> --><a href="/real/">r</a>');
  assert.deepEqual(countBodyLinks(html, '/x/'), ['/real/']);
});

test('returns nothing for a page with no main', () => {
  assert.deepEqual(countBodyLinks('<html><body><a href="/one/">1</a></body></html>', '/x/'), []);
});
