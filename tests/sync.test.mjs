import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const start = html.indexOf("function parseSrt(data)");
const end = html.lastIndexOf("</script>");
assert.notEqual(start, -1, "synchronization functions should exist in index.html");
assert.ok(end > start, "the script closing tag should follow the synchronization functions");

const source = html.slice(start, end);
const { evaluateDynamicResult, validateSubtitleTimeline } = new Function(
  `${source}\nreturn { evaluateDynamicResult, validateSubtitleTimeline };`,
)();

const sub = (startTime, endTime = startTime + 1000) => ({
  id: String(startTime),
  start: startTime,
  end: endTime,
  text: "test",
});

test("accepts a valid monotonic subtitle timeline", () => {
  assert.deepEqual(validateSubtitleTimeline([sub(1000), sub(2000), sub(3000)]), {
    valid: true,
    reason: "",
  });
});

test("rejects a dynamic result that moves backward in time", () => {
  const result = {
    matches: 80,
    syncedSubs: [sub(1000), sub(3000), sub(2000)],
  };

  const decision = evaluateDynamicResult(result, 50, 100);
  assert.equal(decision.useDynamic, false);
  assert.match(decision.reason, /entry 3 starts before entry 2/);
});

test("rejects a dynamic result with too little confidence gain", () => {
  const result = {
    matches: 101,
    syncedSubs: [sub(1000), sub(2000)],
  };

  const decision = evaluateDynamicResult(result, 100, 1000);
  assert.equal(decision.useDynamic, false);
  assert.match(decision.reason, /confidence gain was too small/);
});

test("accepts a valid dynamic result with a meaningful confidence gain", () => {
  const result = {
    matches: 120,
    syncedSubs: [sub(1000), sub(2000), sub(3000)],
  };

  assert.deepEqual(evaluateDynamicResult(result, 100, 1000), {
    useDynamic: true,
    reason: "",
  });
});
