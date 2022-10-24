export class PixabayApi {
  #page = 1;
  #query = '';
  #limit = 40;
  #totalPage = 0;

  async getImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '30730953-a4b99fedc073d2eca0df8a6a8';
    const searchParams = new URLSearchParams({
      key: KEY,
      q: this.#query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.#page,
      per_page: this.#limit,
    });

    const url = `${BASE_URL}?${searchParams}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.status);
    }
    const responseJson = await response.json();
    return responseJson;
  }

  get query() {
    return this.#query;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }

  calculateTotalPage(total) {
    this.#totalPage = Math.ceil(total / this.#limit);
    console.log('#totalPage: ', this.#totalPage);
  }

  get isShowLoadMore() {
    return this.#page < this.#totalPage;
  }
}

// CODE without Axios(down):

//   getImages() {
//     const BASE_URL = 'https://pixabay.com/api/';
//     const KEY = '30730953-a4b99fedc073d2eca0df8a6a8';
//     const searchParams = new URLSearchParams({
//       key: KEY,
//       q: this.#query,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: true,
//       page: this.#page,
//       per_page: this.#limit,
//     });
//     const url = `${BASE_URL}?${searchParams}`;

//     return fetch(url).then(response => {
//       if (!response.ok) {
//         throw new Error(response.status);
//       }
//       return response.json();
//     });
//   }
