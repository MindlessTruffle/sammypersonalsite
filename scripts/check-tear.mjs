import assert from 'node:assert/strict';
import {tearDestination} from '../dist/assets/tear-routes.js';
import {tearTiming as timing} from '../dist/assets/tear-timing.js';
import {cutSeam,shardClip} from '../dist/assets/katana-vfx.js';
const base='http://127.0.0.1:4174/';
assert.equal(tearDestination('/icon-emulator/',base),'/icon-emulator/');
assert.equal(tearDestination('/notes/one-shirt-one-number/',base),'/notes/one-shirt-one-number/');
for(const url of ['https://example.com/icon-emulator/','http://127.0.0.1:3000/shop/','/#notes','/icon-emulator/#detail','/icon-emulator/?download=1','/','javascript:alert(1)','/assets/app.js'])assert.equal(tearDestination(url,base),null);
for(const options of [{modified:true},{target:'_blank'},{download:true},{native:true}])assert.equal(tearDestination('/larpmegle/',base,options),null);
assert.equal(tearDestination('/larpmegle/',base,{target:'_self'}),'/larpmegle/');
console.log('Portal accepts local subpages and preserves external, hash, download, and modified-click navigation.');
assert.equal(timing.total,2000,'Opening takes two seconds');
assert.ok(timing.tearStart>=timing.windup+timing.sweep,'Tearing follows the completed katana cut');
assert.ok(timing.flashStart+timing.flashDuration>timing.tearStart,'Impact flash bridges the cut and tear');
assert.equal(timing.expandStart,timing.tearStart+timing.tearDuration,'Page expansion follows a distinct tearing phase');
assert.ok(timing.contentStart>timing.expandStart,'Article appears inside the expanded opening');
for(const [start,duration] of [['expandStart','expandDuration'],['controlsStart','controlsDuration'],['contentStart','contentDuration']]){
 assert.equal(timing[start]+timing[duration],timing.total,'Split, controls, and article settle together');
}
assert.equal(cutSeam[0][0],0);assert.equal(cutSeam.at(-1)[0],100);
for(const [i,[x,y]] of cutSeam.entries()){
 assert.ok(y>0&&y<100 && (i===0||x>cutSeam[i-1][0]),'Seam crosses the screen without folding back');
 for(const side of ['top','bottom'])assert.ok(shardClip(side).includes(`${x}% ${y}%`),'Both page pieces meet at the same seam');
}
console.log('Two-second katana cut → tear → expansion timing and matching full-width page edges pass.');
