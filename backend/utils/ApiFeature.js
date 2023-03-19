class ApiFeature {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        }:{}

        this.query = this.query.find({...keyword});
    return this;
    }

    filter(){
        const queryCopy = {...this.queryStr};
        console.log(queryCopy);
        //remove some fields for category
        const remove_fields = ['keyword', 'page', 'limit']
        remove_fields.forEach((key) => delete queryCopy[key]);

        //filter price
        var queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        this.query = this.query.find(JSON.parse(queryStr));

        console.log(queryStr);
        return this;
    }

    pagination(resultsPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        //Skipping products from current page to next page
        const skip = resultsPerPage * (currentPage - 1);
        
        this.query = this.query.limit(resultsPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeature;

