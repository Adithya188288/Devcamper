const mongoose = require('mongoose');
const { find, findById, findByIdAndUpdate } = require('./Bootcamp');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please add a course title"]
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum Skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: "Bootcamp",
        required: true
    }
});


//static method to create the average cost within the bootcamp
CourseSchema.statics.getAverageCost = async function (bootcampId) {

    const obj = await this.aggregate([
        {
            $match: {
                bootcamp: bootcampId
            }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]);

    let averageCost =  obj[0].averageCost
    
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost:Math.ceil(averageCost/10) * 10
        })      
    } catch (error) {
           console.log(error); 
    }

};


CourseSchema.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp)
});

CourseSchema.post('remove', function () {
    this.constructor.getAverageCost(this.bootcamp)
});


module.exports = mongoose.model('Course', CourseSchema);