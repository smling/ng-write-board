import { Language } from "./language";

export class WriteBoardOption {
    public lineWidth : number = 3;
    public allowRedo : boolean = true;
    public allowUndo : boolean = true;
    public language : Language = Language.ChineseTraditional;
    public numberOfWords : number = 10;
}
