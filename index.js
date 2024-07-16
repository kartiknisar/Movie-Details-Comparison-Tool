 const autoCompleteConfig={ renderOption(moive){
    const imgSrc=moive.Poster==='N/A'? '':moive.Poster;
    return` 
    <img src="${imgSrc}"/> 
     ${moive.Title}(${moive.Year})
    `
    },
    
    inputValue(moive){
      return moive.Title;
    },
  
     async fetchData ( searchTerm) {
       const response = await axios.get('http://www.omdbapi.com/', {
          params: {
              apikey: '909f7a27',
              s: searchTerm
          }
      });
  
      if (response.data.Error){
          return [];
      }
      return response.data.Search; 
      }

 };

createAutoComplete({
  ...autoCompleteConfig,
  root:document.querySelector('#left-autocomplete'),
  onOptionSelect(moive){
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMoiveSelect(moive,document.querySelector('#left-summary'),'left');
  }
  
});

createAutoComplete({
    ...autoCompleteConfig,
    root:document.querySelector('#right-autocomplete'),
    onOptionSelect(moive){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMoiveSelect(moive,document.querySelector('#right-summary'),'right');
      }
    
  });
  

let leftMovie;
let rightMovie;
const onMoiveSelect= async( moive,summaryElement,side)=>{

    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '909f7a27',
            i: moive.imdbID
        }
});
//console.log(response.data);
summaryElement.innerHTML=moiveTemplate(response.data)

if(side==='left'){
    leftMovie= response.data;

}else {
    rightMovie=response.data;
}

if (leftMovie && rightMovie){
    runComparison();
}
};
const runComparison=()=>{
    const leftSideStats=document.querySelectorAll('#left-summary .notification');
    const rightSideStats=document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat,index)=>{
     const rightStat=rightSideStats[index];

     console.log(leftStat,rightStat)

     

    const leftSideValue=parseInt(leftStat.dataset.value);
    const rightSideValue=parseInt(rightStat.dataset.value);

   if(rightSideValue > leftSideValue){
        leftStat.classList.remove('is-primary');
        leftStat.classList.add('is-warning')
    }
    else{
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning') 

    }
    })
}  

const moiveTemplate=(movieDetail)=>{
//'$623,357,910' =623357
const dollars=parseInt(movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,''))
const metaScore=parseInt(movieDetail.Metascore);
const imdbRating=parseFloat(movieDetail.imdbRating);
const imdbVotes=parseInt(movieDetail.imdbVotes.replace(/,/g,''));
const awards=movieDetail.Awards.split(' ').reduce((prev,word) => {
    const value=parseInt(word);
    
    if(isNaN(value)){
        return prev;

    }else{
      return prev + value
    }
},0) ;


  return`
  <article class='media'>
   <figure class='media-left'>
    <p class='image'>
     <img src='${movieDetail.Poster}'/>
    </p>
   </figure>
   <div class='media-content'>
    <div class='content'>
     <h1>${movieDetail.Title}</h1>
     <h4>${movieDetail.Genre}</h4>
     <p>${movieDetail.Plot}</p>
    </div>
   </div>
  </article>
  <article  data-value=${awards} class='notification is-primary'>
    <p class='title'>${movieDetail.Awards}</p>
    <p class='subtitle'>Awards</p>
  </article>
  <article data-value=${dollars} class='notification is-primary'>
    <p class='title'>${movieDetail.BoxOffice}</p>
    <p class='subtitle'>BoxOffice</p>
  </article>
  <article  data-value=${metaScore} class='notification is-primary'>
    <p class='title'>${movieDetail.Metascore}</p>
    <p class='subtitle'>Metascore</p>
  </article>
  <article data-value=${imdbRating} class='notification is-primary'>
    <p class='title'>${movieDetail.imdbRating}</p>
    <p class='subtitle'>IMMDB Rating</p>
  </article>

  <article data-value=${imdbVotes} class='notification is-primary'>
  <p class='title'>${movieDetail.imdbVotes}</p>
  <p class='subtitle'>IMMDB Votes</p>
  </article>

   
  `;
};
