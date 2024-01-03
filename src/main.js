import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
document.addEventListener('DOMContentLoaded', function () {
  const apiKey = '41611700-7d67ead1fe1a36cc390063edf';
  const searchForm = document.getElementById('searchForm');
  const searchQueryInput = document.getElementById('searchQuery');
  const loader = document.getElementById('loader');
  const galleryContainer = document.getElementById('gallery');
  let lightbox;

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const searchQuery = searchQueryInput.value.trim();

    if (searchQuery === '') {
      iziToast.error({
        title: 'Error',
        message: 'Please enter a search query',
      });
      return;
    }

    loader.style.display = 'block';
    galleryContainer.innerHTML = '';

    fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`
    )
      .then(response => response.json())
      .then(data => {
        loader.style.display = 'none';

        if (data.hits.length === 0) {
          iziToast.info({
            title: 'Info',
            message:
              'Sorry, there are no images matching your search query. Please try again!',
          });
        } else {
          data.hits.forEach(image => {
            const img = document.createElement('img');
            img.src = image.webformatURL;
            img.alt = image.tags;
            img.dataset.large = image.largeImageURL;
            img.dataset.title = `Likes: ${image.likes}, Views: ${image.views}, Comments: ${image.comments}, Downloads: ${image.downloads}`;
            img.classList.add('image-class');
            const a = document.createElement('a');
            a.href = image.largeImageURL;
            a.appendChild(img);

            galleryContainer.appendChild(a);
          });

          lightbox.refresh();
        }
      })
      .catch(error => {
        loader.style.display = 'none';
        console.error('Error fetching images:', error);
      });
  });

  lightbox = new SimpleLightbox('#gallery a');
});
