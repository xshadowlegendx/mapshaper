import api from '../mapshaper.js';
import assert from 'assert';


describe('mapshaper-scalebar.js', function () {
  it('parseScalebarLabelToKm()', function () {
    var toKm = 1.60934;
    var parse = api.internal.parseScalebarLabelToKm;
    assert.equal(parse('1 mile'), toKm);
    assert.equal(parse('1 MILE'), toKm);
    assert.equal(parse('1 / 2 MILE'), 1 / 2 * toKm);
    assert.equal(parse('1/2 MILE'), 1 / 2 * toKm);
    assert.equal(parse('0.5 MILE'), 0.5 * toKm);
    assert.equal(parse('1km'), 1);
    assert.equal(parse('5 k.m.'), 5);
    assert.equal(parse('1 kilometer'), 1);
    assert.equal(parse('5 kilometres'), 5);
    assert.equal(parse('1,000 KILOMETERS'), 1000);
  })

  it('formatDistanceLabel()', function() {
    var format = api.internal.formatDistanceLabel;
    assert.equal(format('1,000', 'mile'), '1,000 MILES')
    assert.equal(format('1', 'mile'), '1 MILE')
    assert.equal(format('1.5', 'mile'), '1.5 MILES')
    assert.equal(format('1/8', 'mile'), '1/8 MILE')
    assert.equal(format('1/8', 'km'), '1/8 KM')
  })

  describe('-scalebar command', function() {
    it ('works without initial data', async function() {
      var file = 'test/data/two_states.json';
      var cmd = `-scalebar -i ${file} -proj lcc -target * -o map.svg`;
      var out = await api.applyCommands(cmd);
      assert(!!out['map.svg']);
    })

    it ('supports custom labels', async function() {
      var file = 'test/data/two_states.json';
      var cmd = `-scalebar "100 k.m." -i ${file} -proj lcc -target * -o map.svg`;
      var out = await api.applyCommands(cmd);
      assert(out['map.svg'].includes("100 k.m."));
    })

    it('error thrown when map is unprojected', async function() {
      var file = 'test/data/two_states.json';
      var cmd = `-scalebar "100 k.m." -i ${file} -target * -o map.svg`;
      assert.rejects(async function() {
        var out = await api.applyCommands(cmd);
      })
    })

    // TODO: decide if we want to skip scalebar in GeoJSON output
    // it ('GeoJSON output', async function() {
    //   var file = 'test/data/two_states.json';
    //   var cmd = `-scalebar -i ${file} -proj lcc -target * -o map.geojson`;
    //   var out = await api.applyCommands(cmd);
    // });

  })
})
