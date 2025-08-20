class APIFeatures{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

        // for searching
    search(){
       let keyword = this.queryStr.keyword ? {
        name:{
            $regex:this.queryStr.keyword,
            $options: 'i'
        }
       } : {} ;

       this.query.find({...keyword})
       return this;
    }


    // for filter get a query copy url will have addition stup so want to remove other keywords 
    // and want to get filter so we getting a copy of query str
    filter(){
        const queryStrCopy ={...this.queryStr};
        //before
        //console.log(queryStrCopy);

        //removing fields from query
        const removeFields =['keyword','limit','page'];
        removeFields.forEach(field=>delete queryStrCopy[field]);

        let queryStr = JSON.stringify(queryStrCopy);
        //console.log(queryStr);
        
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)/g, match=>`$${match}`);
        //console.log(queryStr);
        
        //after
        //console.log(queryStrCopy);

        this.query.find(JSON.parse(queryStr));
        return this;
        
    }

    //paging product paging on website last
    paginate(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
}



}

module.exports = APIFeatures;