const fs = require('fs');
const path = require('path');
const express = require('express');
const YoutubeMp3Downloader = require('youtube-mp3-downloader');

const app = express();

// initial properties
app.use(express.json({ limit: '10kb' }));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.status(200).render('homepage');
});

app.post('/convert', (req, res) => {
	const { id } = req.body;
	const YD = new YoutubeMp3Downloader({
		ffmpegPath: path.join(__dirname, 'ffmpeg.exe'),
		outputPath: path.join(__dirname, 'Converted'),
		youtubeVideoQuality: 'highestaudio',
		queueParallelism: 2,
		progressTimeout: 2000,
		allowWebm: false,
	});

	YD.download(id);

	YD.on('finished', (err, data) => {
		res.status(200).json({ success: true, data: { data } });
	});
});

app.get('/download/:fileName', (req, res) => {
	const { fileName } = req.params;
	res.download(
		`${__dirname}/Converted/${fileName}.mp3`,
		`${fileName}.mp3`,
		(err) => {
			if (err) {
				console.log(err);
			} else {
				fs.unlink(`${__dirname}/Converted/${fileName}.mp3`, (err) => {
					if (err) throw err;
					console.log('Deleted');
				});
			}
		}
	);
});

const PORT = 3000;
app.listen(PORT, function () {
	console.log(`Server Started On Port ${PORT}`);
});
