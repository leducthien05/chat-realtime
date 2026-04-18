

module.exports.index = async (req, res)=>{
    res.render("chat/index", {
        titlePage: "Chat"
    });
}