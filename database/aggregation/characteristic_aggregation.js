db.getCollection("reviews").aggregate(
  [
      {
          "$lookup" : {
              "from" : "characteristicreviews",
              "localField" : "id",
              "foreignField" : "review_id",
              "as" : "characteristics"
          }
      },
      {
          "$unwind" : {
              "path" : "$characteristics",
              "preserveNullAndEmptyArrays" : true
          }
      },
      {
          "$lookup" : {
              "from" : "characteristics",
              "localField" : "characteristics.id",
              "foreignField" : "id",
              "as" : "characteristics.name"
          }
      },
      {
          "$unwind" : {
              "path" : "$characteristics.name",
              "preserveNullAndEmptyArrays" : true
          }
      },
      {
          "$group" : {
              "_id" : "$id",
              "id" : {
                  "$first" : "$id"
              },
              "product_id" : {
                  "$first" : "$product_id"
              },
              "rating" : {
                  "$first" : "$rating"
              },
              "date" : {
                  "$first" : "$date"
              },
              "summary" : {
                  "$first" : "$summary"
              },
              "body" : {
                  "$first" : "$body"
              },
              "recommend" : {
                  "$first" : "$recommend"
              },
              "reported" : {
                  "$first" : "$reported"
              },
              "reviewer_name" : {
                  "$first" : "$reviewer_name"
              },
              "reviewer_email" : {
                  "$first" : "$reviewer_email"
              },
              "response" : {
                  "$first" : "$response"
              },
              "helpfulness" : {
                  "$first" : "$helpfulness"
              },
              "characteristics" : {
                  "$push" : "$characteristics"
              }
          }
      },
      {
          "$out" : "charCombined"
      }
  ],
  {
      "allowDiskUse" : true
  }
);