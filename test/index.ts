import Uploader,{Files, Result} from "../src/index.ts";

import fs from 'node:fs'
import assert from "node:assert";
import test, { before, describe } from "node:test";
import path from "node:path";

const mainUploader = async (imageData :Files)=>{
    try {
        const data = await Uploader(imageData);
        return data;
    } catch (error) {
        throw error;   
    }
}

describe('1.Simplet Test',{skip:false},(suiteContext)=>{
    test('Synchronous passing test', (testContext) => {
        assert.strictEqual(1, 1);
      });
});

describe('2.Upload Image From Url:',{skip:false},async (suiteContext)=>{
    let apiResult : Result ;
    before(async ()=>{
        const imageUrl = "https://images.freeimages.com/images/large-previews/c0d/gerbera-series-1-1486599.jpg";
        const result = await mainUploader(imageUrl);
        apiResult = result;
        
        
    });
    test('Uploading a single file:',async (testContext)=>{
       assert.equal(true,apiResult.ok);
       assert.equal(typeof apiResult.files?.at(0)?.original_url, 'string');

    });
});

describe('3.Upload Image From File:',async (suiteContext)=>{
    let apiResult : Result ;
    before(async ()=>{
        const imagePath = path.join(__dirname,'img','294850.png');
        const imageData = fs.readFileSync(imagePath);
        console.log('*'.repeat(30),imagePath)
        const result = await mainUploader(imageData);
        apiResult = result;
    });
    test('Uploading a file:',async (testContext)=>{
       assert.equal(true,apiResult.ok);
       assert.equal(typeof apiResult.files?.at(0)?.original_url, 'string','Uploaded!');
    });
});