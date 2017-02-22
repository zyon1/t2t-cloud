import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/
@Pipe({name: 'MultiFilter'})
export class MultiFilterPipe implements PipeTransform {
  transform(x:any[], pairs:any) {
    //console.log("transform initialized");
   //filters 
      //pairs = property:value pairs 
      //in case same properties can have multiple value pairs should be defined as followed
      // {property:[value1, value2]}
      //if value of property fits inside interval it should be defined as followed
      // {property:{eqStart:true, eqEnd:false, iStart:"start of interval", iEnd:"end of interval"}}
      //  if value in data is string it searches if string contains searched value 
      let keys=Object.keys(pairs);
      //console.log(keys);
      let newData=[];
      let counter, tempCount, expression;
      for (let i=0;i<x.length;i++){
          
        //iterate data then apply multiple filters
        //set counter value 0 for each itteration trough data
        //if all pairs satisfies conditions counter should equal (keys.length - 1)
        //for effitiency when condition is not satisfied loop should be broken on first fail
        counter=0;
        for (let j=0; j < keys.length; j++ ){
          //iterrate through pairs
          //console.log("i",i,"j",j);
          if (typeof pairs[keys[j]] != 'undefined'){
          if (pairs[keys[j]].constructor === Array){
            //if property has multiple values itterate trough values

            tempCount=counter;
            for (let k=0; k < pairs[keys[j]].length; k++){
              
              //create regexp to perform case insensitive search
              let rExp = new RegExp(pairs[keys[j]][k], "i");
              //if value is a string expression searches the string if it is number finds exact match
              expression=(typeof x[i][keys[j]] == 'string' || x[i][keys[j]] instanceof String)?x[i][keys[j]].search(rExp)>-1:x[i][keys[j]]==pairs[keys[j]][k];
              if (expression){
                counter++;
              }
            }
                     

            if (tempCount==counter){
              //break itteration because one condition isn't satisfied for data x[i]
              break;
            }
          }else{

            //if not array but is object and property['iStart'] is not null and not undefined check if value is from interval
            if( typeof pairs[keys[j]]['iStart'] !== 'undefined' && pairs[keys[j]]['iStart'] !== null ){
              // if value is from interval
              let leftLimit=pairs[keys[j]]['eqStart']?x[i][keys[j]] >= pairs[keys[j]]['iStart']:x[i][keys[j]] > pairs[keys[j]]['iStart'];
              //console.log("liva:"+(x[i][keys[j]] - pairs[keys[j]]['iStart'])+" : "+leftLimit);
              let rightLimit=pairs[keys[j]]['eqEnd']?x[i][keys[j]] <= pairs[keys[j]]['iEnd']:x[i][keys[j]] < pairs[keys[j]]['iEnd'];
              //console.log("desna:"+(x[i][keys[j]] - pairs[keys[j]]['iEnd'])+" : "+rightLimit);
              //console.log(x[i][keys[j]] );
              if (leftLimit &&  rightLimit){
                counter++;
              }
              else{
                //break itteration because one condition isn't satisfied for data x[i]
                break;
              }
            }else{
              //create regexp to perform case insensitive search
              let rExp = new RegExp(pairs[keys[j]], 'i');
              //if value is a string expression searches the string if it is number finds exact match
              expression=(typeof x[i][keys[j]] == 'string' || x[i][keys[j]] instanceof String)?x[i][keys[j]].search(rExp)>-1:x[i][keys[j]]==pairs[keys[j]];
              //if property has one value make comparsion
              //console.log(expression);
              //console.log(pairs[keys[j]]);
              if (expression){
                counter++;

              }  
              else {
                //break itteration because condition isn't satisfied for data x[i]
                break;
              }
            }
          }
        //console.log(counter);
}else{counter++;}

          //if all conditions are satisfied
           if (counter >= keys.length){
            newData.push(x[i]);
            //console.log(newData);
          }
          
                  }
      }
      return newData;





  }
}