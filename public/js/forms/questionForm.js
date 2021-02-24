import { Filter } from "../utils/filterTopics";
import { temas, subtemas } from "../utils/data";
const topics = document.querySelector('.topics');;
const subtopics = document.querySelector('.subtopics');
const subjectInput = document.getElementById('subject');
const topicsInput = document.getElementById('topics');
const subtopicstInput = document.getElementById('subtopics');

export class QuestionForm {
    static showPage = () => {
        let stepIndex = 0;
        const steps = document.querySelectorAll('fieldset');
        const nextBtns = document.querySelectorAll('.nextBtn');
        const prevBtns = document.querySelectorAll('.prevBtn');
        currentPage(nextBtns, '+');
        currentPage(prevBtns, '-');
        
        function currentPage(domArray, inc) {
            domArray.forEach( button => button.addEventListener('click', () => {
                steps[stepIndex].classList.add('hidden');
                inc === '+' ? stepIndex++ : stepIndex--; 
                steps[stepIndex].classList.remove('hidden');
            }));    
        }
    }
    static showTopics = () => {
        Filter.removeOptions(topics);
        const subject = document.querySelector('.subject');
        [...subject.options].forEach( option => {
                option.onclick( function() {
                    input.value = this.value;
                })
                console.log(e);
                Filter.addOption(topics, temas[e.target.value]);
        });
    }

    static showSubTopics = () => {
        Filter.removeOptions(subtopics);
        topics.addEventListener('change', e => {
            console.log(e);
            Filter.createDatalist(subtopics, subtemas[e.target.value]);
        });
    }
}
