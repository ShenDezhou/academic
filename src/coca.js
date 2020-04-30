const csv=require('csvtojson')
import csvStrings from '!raw-loader!../static/data/coca-families.csv'

// 相关查询接口
export function cocaFamily(keywords) {
  var result = []
  var r = csv()
    .fromString(csvStrings)
    .then((csvRow)=>{
      for(var key in csvRow){
        // console.log(csvRow[key])
      if (csvRow[key].word==keywords||csvRow[key].family==keywords)
        result.push(csvRow[key])
      }

    })
  return result
}
