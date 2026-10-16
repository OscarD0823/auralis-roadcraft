import assert from 'node:assert/strict'
import {readRecovery,writeRecovery,matchingSaveDraft} from '../src/renderer/recovery'
import type {SaveGameData} from '../src/shared'
const values=new Map<string,string>()
const storage={getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>{values.set(k,v)}}
const entry={values:{fuel:500},baseline:{fuel:100},conflicts:[],applyToVariants:true}
writeRecovery(storage,{version:1,entries:{truck:entry}})
assert.deepEqual(readRecovery(storage).entries.truck,entry)
const saved={filePath:'game.dat',modifiedAt:42} as SaveGameData
assert.equal(matchingSaveDraft(saved,{...saved,modifiedAt:43}),undefined)
assert.deepEqual(matchingSaveDraft(saved,saved),saved)
values.set('roadcraft-studio-recovery-v1','{"version":1,"entries":{"truck":{"values":{"fuel":null}}}}')
assert.deepEqual(readRecovery(storage).entries,{})
console.log('Recovery passed: pending exact-source values survive reopening, malformed metadata and changed game saves do not apply.')
