const express = require("express")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.post("/identify", async (req, res) => {

  const { email, phoneNumber } = req.body

  const contacts = await prisma.contact.findMany({
    where:{
      OR:[
        { email: email },
        { phoneNumber: phoneNumber }
      ]
    }
  })

  if(contacts.length === 0){

    const newContact = await prisma.contact.create({
      data:{
        email,
        phoneNumber,
        linkPrecedence:"primary"
      }
    })

    return res.json({
      contact:{
        primaryContactId:newContact.id,
        emails:[email],
        phoneNumbers:[phoneNumber],
        secondaryContactIds:[]
      }
    })
  }

  let primary = contacts.find(c => c.linkPrecedence === "primary") || contacts[0]

  const emails = new Set()
  const phones = new Set()
  const secondaryIds = []

  contacts.forEach(c=>{
    if(c.email) emails.add(c.email)
    if(c.phoneNumber) phones.add(c.phoneNumber)

    if(c.linkPrecedence === "secondary")
      secondaryIds.push(c.id)
  })

  if(email) emails.add(email)
  if(phoneNumber) phones.add(phoneNumber)

  res.json({
    contact:{
      primaryContactId:primary.id,
      emails:[...emails],
      phoneNumbers:[...phones],
      secondaryContactIds:secondaryIds
    }
  })

})

app.listen(3000, ()=>{
  console.log("Server running on port 3000")
})