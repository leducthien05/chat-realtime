module.exports.search = (query)=>{
    const objectSearch = {
        keyword: ""
    };
    if(query.keyword){
        objectSearch.keyword = query.keyword;
        const regex = new RegExp(query.keyword, "i");
        objectSearch.regex = regex;
    }
    return objectSearch;
}