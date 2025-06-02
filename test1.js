const axios = require('axios');
const cheerio = require('cheerio');
link = 'https://bulletin.du.edu/undergraduate/coursedescriptions/comp';

const fs = require('fs');
const path = require('path');

axios.get(link)
    .then(response => {
    const $ = cheerio.load(response.data);
    // Extract data using jQuery-like selectors
    const course = $('p.courseblocktitle').text();
    const prereq = $('p.courseblockdesc a.bubblelink code').text();
    
    const courses = [];

    $('.courseblock').each((index, element) => {
        const courseBlock = $(element);
        const courseName = courseBlock.find('.courseblocktitle').text().trim();
        const courseDesc = courseBlock.find('.courseblockdesc').text().trim();

        const words = courseName.split(' ');
        const courseInfo = words[0];
        const courseNumber = parseInt(courseInfo.split(/\s+/g)[1]);
        console.log(courseNumber);
        const req = courseNumber >= 3000 && !courseDesc.toLowerCase().includes('prerequisite');
        if (req) {
            const courseTitle = words.slice(1).join(' ').trim();
        
            courses.push({
                course: courseInfo,
                title: courseTitle
            });
        };
        

    }); 
    const results1 = 'results';
    const Path = path.join(results1, 'bulletin.json');
    fs.writeFileSync(Path, JSON.stringify({courses}, null, 2));
    console.log('It works! (Hopefully)');
    })
    .catch(error => {
        console.error('Error fetching and parsing the page:', error);
    });

