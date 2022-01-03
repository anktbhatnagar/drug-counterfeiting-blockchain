'use strict';

class BaseModel{

    constructor(){}

    static getJSONFromBuffer(buffer){

        if(!buffer){
            return null;
        }

        if(Buffer.isBuffer(buffer)){
            if(!buffer.length){
                return null;
            }

            return JSON.parse(buffer.toString());
        }
        return buffer;
    }

    toBuffer(){
        return Buffer.from(JSON.stringify(this));
    }

}

module.exports={BaseModel};