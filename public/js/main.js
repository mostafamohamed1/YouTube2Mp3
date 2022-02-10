if (module.hot) {
	module.hot.accept();
}

import axios from 'axios';

const form = document.querySelector('.form');
const input = document.querySelector('#url');
const btn = document.querySelector('.form button');
const information = document.querySelector('.information');

form.addEventListener('submit', function (e) {
	e.preventDefault();
});

btn.addEventListener('click', async function () {
	if (input.value.length !== 0) {
		information.innerHTML = '<div class="spinner"></div>';
		try {
			let id = input.value.split('=')[1];
			let data = await axios({ method: 'POST', url: '/convert', data: { id } });
			const info = data.data.data.data;

			information.innerHTML = `
			<figure>
				<img src="${info.thumbnail}" alt="${info.title}" />
			</figure>
			<div class="details">
				<ul>
					<li><span>Video Title: </span><span>${info.videoTitle}</span></li>
					<li>
						<span>Url YouTube Video: </span
						><a href="${info.youtubeUrl}" target="_blank">${info.youtubeUrl}</a>
					</li>
					<li><span>Artist: </span><span>${info.artist}</span></li>
					<li><span>Title: </span><span>${info.title}</span></li>
					<li>
						<a href="/download/${info.videoTitle}"  class="download">Download: ${info.videoTitle}</a>
					</li>
				</ul>
			`;
		} catch (err) {
			alert('Error please try again');
		}
	}
});

document.addEventListener('click', function (e) {
	if (e.target.className === 'download') {
		setTimeout(() => {
			window.location.reload();
		}, 2000);
	}
});
