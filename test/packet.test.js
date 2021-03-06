/*!
 * tair - test/packet.test.js
 * Copyright(c) 2012 Taobao.com
 * Author: kate.sf <kate.sf@taobao.com>
 */

var rewire = require('rewire');
var packet = rewire('../lib/packet.js');
var should = require('should');
var consts = require('../lib/const');

describe('packet.test.js', function () {

  it('#requestGetGroupPacket should build right packet content', function () {
    var _buf = packet.requestGetGroupPacket('groups', 1);
    _buf.should.length(31);
    var phead = _buf.readInt32BE(0);
    phead.should.equal(consts.TAIR_PACKET_FLAG);
  });

  it('writePacketBegin will not reply chid = 0 anytime', function () {
    packet.__set__('chid', 0);
    var _buf = packet.writePacketBegin(10, 10)[0];
    var chid = _buf.readUInt32BE(4);
    chid.should.above(0);
    packet.__set__('chid', -100);
    _buf = packet.writePacketBegin(10, 10)[0];
    chid = _buf.readUInt32BE(4);
    chid.should.above(0);
    packet.__set__('chid', 100000000);
    _buf = packet.writePacketBegin(10, 10)[0];
    chid = _buf.readUInt32BE(4);
    chid.should.above(0);
    packet.__set__('chid', -100000000);
    _buf = packet.writePacketBegin(10, 10)[0];
    chid = _buf.readUInt32BE(4);
    chid.should.above(0);
    packet.__set__('chid', 1);
    _buf = packet.writePacketBegin(10, 10)[0];
    chid = _buf.readUInt32BE(4);
    chid.should.above(0);
  });

  it('#writePacketEnd should work', function () {
    var _buf = new Buffer(10);
    packet.writePacketEnd(_buf, 0);
  });

  it('#readString #writeString', function () {
    var str = 'ccccssssddd';
    var buffer = new Buffer(30);
    var enc = packet.writeString(buffer, 0, str);
    var dec = packet.readString(buffer, 0);
    dec[0].should.equal(str);
  });

  it('#bad packet should return null', function (done) {
    var nullpacket = null;
    var badpacket = new Buffer('xx');
    packet.responseMGetPacket(nullpacket);
    packet.responseMGetPacket(badpacket);
    packet.responseGetPacket(nullpacket);
    packet.responseGetPacket(badpacket);
    packet.responseGetGroupPacket(nullpacket, function (err) {
      should.exist(err);
      done();
    });

  });

});