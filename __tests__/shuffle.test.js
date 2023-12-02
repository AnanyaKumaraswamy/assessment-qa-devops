const shuffle = require("../src/shuffle");
const bots = require("../src/botsData");

describe("shuffle should...", () => {
  // CODE HERE
  it("should return an array", () => {
    let testShuffled = shuffle(bots);
    const result = Array.isArray(testShuffled);
    expect(result).toBe(true);
  });

  it("should return an array of length 10", () => {
    let testShuffled = shuffle(bots);
    const resultLength =testShuffled.length;
    console.log('array length:' , resultLength);
    expect(resultLength).toBe(10);
  });

});

