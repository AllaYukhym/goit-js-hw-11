import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayApi } from './js/PixabayApi';
import { createMarkup } from './js/createMarkup';
import { ref } from './js/refs';

const pixabayApi = new PixabayApi();

async function onFormSubmit(e) {
  e.preventDefault();

  const searchQuery = e.currentTarget.searchQuery.value.trim().toLowerCase();
  if (!searchQuery) {
    return;
  }
  pixabayApi.query = searchQuery;

  clearPage();

  try {
    const { hits, totalHits } = await pixabayApi.getImages();
    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notify.info(`Hooray! We found ${totalHits} images.`);
    }
    const markup = createMarkup(hits);
    ref.containerForImages.insertAdjacentHTML('beforeend', markup);

    pixabayApi.calculateTotalPage(totalHits);

    if (pixabayApi.isShowLoadMore) {
      ref.btnLoadMore.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error.message);
    clearPage();
  }
}

async function onBtnLoadMore() {
  pixabayApi.incrementPage();

  if (!pixabayApi.isShowLoadMore) {
    ref.btnLoadMore.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  try {
    const { hits } = await pixabayApi.getImages();
    const markup = createMarkup(hits);
    ref.containerForImages.insertAdjacentHTML('beforeend', markup);
  } catch (error) {
    console.log(error.message);
    clearPage();
  }
}

ref.form.addEventListener('submit', onFormSubmit);
ref.btnLoadMore.addEventListener('click', onBtnLoadMore);

function clearPage() {
  pixabayApi.resetPage();
  ref.containerForImages.innerHTML = '';
  ref.btnLoadMore.classList.add('is-hidden');
}

// CODE without Axios(down):

// function onFormSubmit(e) {
//   e.preventDefault();

//   const searchQuery = e.currentTarget.searchQuery.value.trim().toLowerCase();
//   if (!searchQuery) {
//     return;
//   }
//   pixabayApi.query = searchQuery;

//   clearPage();

//   pixabayApi
//     .getImages()
//     .then(({ hits, totalHits }) => {
//       if (hits.length === 0) {
//         Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       } else {
//         Notify.info(`Hooray! We found ${totalHits} images.`);
//       }
//       const markup = createMarkup(hits);
//       ref.containerForImages.insertAdjacentHTML('beforeend', markup);

//       pixabayApi.calculateTotalPage(totalHits);

//       if (pixabayApi.isShowLoadMore) {
//         ref.btnLoadMore.classList.remove('is-hidden');
//       }
//     })
//     .catch(error => {
//       console.log(error.message);
//       clearPage();
//     });
// }

// function onBtnLoadMore() {
//   pixabayApi.incrementPage();

//   if (!pixabayApi.isShowLoadMore) {
//     ref.btnLoadMore.classList.add('is-hidden');
//     Notify.info("We're sorry, but you've reached the end of search results.");
//   }

//   pixabayApi
//     .getImages()
//     .then(({ hits }) => {
//       const markup = createMarkup(hits);
//       ref.containerForImages.insertAdjacentHTML('beforeend', markup);
//     })
//     .catch(error => {
//       console.log(error.message);
//       clearPage();
//     });
// }
