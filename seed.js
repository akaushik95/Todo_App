var statusENUMS = {
    ACTIVE : "ACTIVE",
    COMPLETED : "COMPLETED",
    DELETED : "DELETED"
}

var todos = {
    1 : {title : "Understand Git", status : statusENUMS.ACTIVE},
    2 : {title : "Install Webstrom", status : statusENUMS.ACTIVE},
    3 : {title : "Learn CSS", status : statusENUMS.ACTIVE},
    4 : {title : "Async JS", status : statusENUMS.COMPLETED},
    5 : {title : "Understanding Callbacks", status : statusENUMS.COMPLETED},
    6 : {title : "Go swimming", status : statusENUMS.DELETED},
    7 : {title : "Go for cycling", status : statusENUMS.DELETED}
}

var nextID = 8;

module.exports = {
    statusENUMS : statusENUMS,
    todos : todos,
    nextID : nextID
}