import { Filter } from "../utils/filterTopics";
import { temas, subtemas } from "../utils/data";
import { resize } from "../utils/resize";
const topics = document.querySelector('#topics');;
const subtopics = document.querySelector('#subtopics');
const subject = document.querySelector('#subject');
const textareas = document.querySelectorAll('textarea');
const topicList = document.querySelector('.topics');
const subTopicList = document.querySelector('.subtopics');
let counter = 0;
export class QuestionForm {
    static showPage = () => {
        textareas.forEach( textarea => resize(textarea));
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

    static closeTopic(name, tag) {
        let data = document.createElement('li');
        data.innerHTML = `<span class="close-${counter}">X</span> ${name}`
        data.classList.add(`${tag}-${counter}`);
        tag === 'topic' ? topicList.appendChild(data) : subTopicList.appendChild(data);
        data = document.querySelector(`.${tag}-${counter}`);
        let close = document.querySelector(`.close-${counter}`);
        close.addEventListener('click', () => {
            data.remove();
        });
        counter++;
    }

    static removeData() {
        subject.addEventListener('change', () => {
            
            Filter.removeOptions(topics);
            Filter.removeOptions(subtopics);
        });
    }

    static showTopics() {
        subject.addEventListener('change', e => {
            Filter.removeOptions(topics);
            Filter.addOptions(topics, temas[e.target.value]);
        });
    }

    static showSubTopics() {
        topics.addEventListener('change', e => {
            this.closeTopic(e.target.value, 'topic');
            //this.addSelect(topics);
            Filter.removeOptions(subtopics);
            Filter.addOptions(subtopics, subtemas[e.target.value]);
        });
        subtopics.addEventListener('change', e => {
            this.closeTopic(e.target.value, 'subtopic');
            //this.addSelect(subtopics);
        });
    }

    static addSelect(domElement) {
        const select = document.createElement('select');
        domElement.insertAdjacentElement('afterend', select);
    }

    
}
