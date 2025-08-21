const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns")

const connectionRequestModel = require("../models/connectionRequest");
const sendEmail = require("./sendEmail")

// This job will run at 8AM everyday
cron.schedule("0 8 * * *", async () => {
    // Send emails to all people who got connection request the previous day

    try{
        const yesterday = subDays(new Date(), 1)
        const yesterdayStart = startOfDay(yesterday)
        // const yesterdayEnd = endOfDay(yesterday);
        const endDate = new Date()

        const pendingRequests = await connectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lte: endDate, // from yesterday 12 AM till this current minute/second
                // $lte: yesterdayEnd,
            },
        }).populate("fromUserId toUserId")

        // const listOfEmails = [...new Set(pendingRequests.map(request => request.toUserId.emailId))]
        // const  = {} 
        // pendingRequests.map(request => listOfEmails[request.fromUserId.emailId].push(request.toUserId.emailId))

        const listOfEmails = pendingRequests.reduce((acc, request) => {
            if (!acc[request.fromUserId.emailId]) {
              acc[request.fromUserId.emailId] = []; // Initialize an empty list for the key if it doesn't exist
            }
            acc[request.fromUserId.emailId].push(request.toUserId.emailId); // Add the current index to the list
            return acc;
          }, {});


        console.log(listOfEmails);
        
        // for(const email of listOfEmails){
        //     //send emails
        //     try{
        //         const res = await sendEmail.run("DevFinder: New Friend Request pending for " + email, "Please login to DevFinder.site and accept or reject the request from " + email + ".");
        //     }catch (err){
        //         console.error(err);
        //     }
        // }

        for (const [fromEmail, toEmail] of Object.entries(listOfEmails)) {
            //send emails
            try{
                const res = await sendEmail.run("DevFinder: New Friend Request pending for " + toEmail, 
                    "Please login to DevFinder.site and accept or reject the request from " + toEmail + ".",
                fromEmail);

                console.log("Response = ", res);
                
            }catch (err){
                console.error(err);
            }
        }
    }
    catch (err){
        console.error(err);
    }
})