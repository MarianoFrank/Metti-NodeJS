export const formNewGroup = (req,res) => {
    res.render('group/new', {
        pageName: 'Nuevo grupo',
        messages: req.flash()
    })
}

export const createGroup = (req,res) => {
    
}