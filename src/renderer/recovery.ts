import type {SaveGameData} from '../shared';
import type {EntryDraft} from './entry-drafts';
const KEY='roadcraft-studio-recovery-v1';
export type Recovery={version:1;entries:Record<string,EntryDraft>;save?:SaveGameData;selected?:string};
export function readRecovery(storage:Pick<Storage,'getItem'>):Recovery{
 const empty:Recovery={version:1,entries:{}};
 try{const raw=JSON.parse(storage.getItem(KEY)??'null');if(raw?.version!==1||!raw.entries||typeof raw.entries!=='object')return empty;
  for(const[id,d]of Object.entries(raw.entries)){const v=d as EntryDraft;if(!id||['__proto__','constructor','prototype'].includes(id)||!v||typeof v!=='object'||!v.values||!v.baseline||!Array.isArray(v.conflicts)||typeof v.applyToVariants!=='boolean'||![...Object.values(v.values),...Object.values(v.baseline)].every(x=>typeof x==='string'||typeof x==='boolean'||typeof x==='number'&&Number.isFinite(x)))return empty;}
  const save=raw.save;if(save&&(!Number.isFinite(save.modifiedAt)||typeof save.filePath!=='string'||!Number.isFinite(save.money)||!Number.isFinite(save.xp)||typeof save.companyName!=='string'||!Array.isArray(save.trucks)||!Array.isArray(save.maps)))delete raw.save;
  return {version:1,entries:raw.entries,save:raw.save,selected:typeof raw.selected==='string'?raw.selected:undefined};
 }catch{return empty;}
}
export function writeRecovery(storage:Pick<Storage,'setItem'>,value:Recovery){storage.setItem(KEY,JSON.stringify(value));}
/** Only recover an unapplied game draft against the exact file revision it came from. */
export function matchingSaveDraft(current:SaveGameData,recovered?:SaveGameData){return recovered?.filePath===current.filePath&&recovered.modifiedAt===current.modifiedAt?recovered:undefined;}
