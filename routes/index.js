var express = require('express');
var router = express.Router();

//node installed dependencies
var request = require('request');
const csv = require('csvtojson');
var lyr = require('lyrics-fetcher');
var sentiment = require('sentiment');
var snowball = require('node-snowball');

//getting the lyrics based of the song name and artist
function getLyrics(list, index, fn) {
    lyr.fetch(list[index].Artist, list[index]['Track Name'], function(err, lyrics) {
        if (err) {
            console.log('err');
        }

        //return lyrics through callback
        fn(lyrics);
    });
}

//simplifying string to make it easier to analyze
function splitString(string) {
    var words = string
        .replace(/[.,?!;()-]/g, " ")
        .replace(/\s+/g, " ")
        .toLowerCase()
        .split(" ");

    return words;
}

//using AFinn to get sentiment analysis on the the lyrics,
//recieveing a score, all words, possitive words, and negative words
function getSentimentScore(string) {
    var temp = [];
    var songArray = splitString(string);

    //if theres no lyrics, thre is no need to do anything else
    if (songArray.length < 20) {
        return 'No Lyrics';
    }

    //getting the stem from each word, to increase the number of matches with the afinn database
    songArray.forEach(function(word) {
        var tempWord = snowball.stemword(word);
        temp.push(tempWord);
    })
    var editedLyrics = temp.join(' ');
    var sentimentAnalysis = sentiment(editedLyrics);

    return sentimentAnalysis;
}

//counting words from the lyrics to see which words are used the most, could be usefulll later on
function countWords(string) {
    var index = {};
    var tempWords = splitString(string);

    //if theres no lyrics, thre is no need to do anything else
    if (tempWords.length < 20) {
        return 'No Lyrics';
    }

    tempWords.forEach(function(word) {
        if (!(index.hasOwnProperty(word))) {
            index[word] = 0;
        }
        index[word]++;
    });

    return index;
}

//defining the treshold for the 4 different moods and placing the song in that bucket
function getMood(songObj) {
    var trackName = songObj['Track Name'];
    var artistName = songObj['Artist'];
    var analysis = songObj['Sentiment Analysis'];
    var allWords = songObj['Number Of Words'];
    var score;
    if (analysis['score']) {
        score = analysis['score'];
    } else {
        score = undefined;
    }
    var mood = [];

    if (score == undefined) {
        mood.push('Relaxing');
    }

    if (score >= 15) {
        mood.push('Happy');
    }

    if (score >= 50) {
        mood.push('Pumped');
    }

    if (score <= 15) {
        mood.push('Relaxing');
    }

    if (score <= -50) {
        mood.push('Sad');
    }

    return mood;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {});
});

router.get('/pumped', function(req, res, next) {
    var jsonMusic = [];
    var top20 = [];

    //recieving 10 songs from spotify's top 200 world songs, this way the songs are both popular by a vast number of people and are chosen somewhat randomly and are indifferent to my taste in music
    request.get('https://spotifycharts.com/regional/global/daily/latest/download', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var csvStr = body;

            //spotify returns a csv file, so I must convert it to a json object
            //for easier management
            csv()
                .fromString(csvStr)
                .on('json', (jsonObj) => {
                    jsonMusic.push(jsonObj);
                })
                .on('done', () => {
                    top20 = jsonMusic.slice(0, 10);

                    //deleating some fields that arent pertinent to this project
                    top20.forEach(function(item) {
                        delete item.Position;
                        delete item.Streams;
                        delete item.URL;
                    });

                    //due to the fact that I'm only analyzing 10 songs I decided to analyze each one instead of using any sort of loop for efficiency
                    getLyrics(top20, 0, function(lyrics) {
                        top20[0]['Lyrics'] = lyrics;
                        top20[0]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[0]['Number Of Words'] = countWords(lyrics);
                        top20[0]['Mood'] = getMood(top20[0]);
                    });

                    getLyrics(top20, 1, function(lyrics) {
                        top20[1]['Lyrics'] = lyrics;
                        top20[1]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[1]['Number Of Words'] = countWords(lyrics);
                        top20[1]['Mood'] = getMood(top20[1]);
                    });

                    getLyrics(top20, 2, function(lyrics) {
                        top20[2]['Lyrics'] = lyrics;
                        top20[2]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[2]['Number Of Words'] = countWords(lyrics);
                        top20[2]['Mood'] = getMood(top20[2]);
                    });

                    getLyrics(top20, 3, function(lyrics) {
                        top20[3]['Lyrics'] = lyrics;
                        top20[3]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[3]['Number Of Words'] = countWords(lyrics);
                        top20[3]['Mood'] = getMood(top20[3]);
                    });

                    getLyrics(top20, 4, function(lyrics) {
                        top20[4]['Lyrics'] = lyrics;
                        top20[4]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[4]['Number Of Words'] = countWords(lyrics);
                        top20[4]['Mood'] = getMood(top20[4]);
                    });

                    getLyrics(top20, 5, function(lyrics) {
                        top20[5]['Lyrics'] = lyrics;
                        top20[5]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[5]['Number Of Words'] = countWords(lyrics);
                        top20[5]['Mood'] = getMood(top20[5]);
                    });

                    getLyrics(top20, 6, function(lyrics) {
                        top20[6]['Lyrics'] = lyrics;
                        top20[6]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[6]['Number Of Words'] = countWords(lyrics);
                        top20[6]['Mood'] = getMood(top20[6]);
                    });

                    getLyrics(top20, 7, function(lyrics) {
                        top20[7]['Lyrics'] = lyrics;
                        top20[7]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[7]['Number Of Words'] = countWords(lyrics);
                        top20[7]['Mood'] = getMood(top20[7]);
                    });

                    getLyrics(top20, 8, function(lyrics) {
                        top20[8]['Lyrics'] = lyrics;
                        top20[8]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[8]['Number Of Words'] = countWords(lyrics);
                        top20[8]['Mood'] = getMood(top20[8]);
                    });

                    getLyrics(top20, 9, function(lyrics) {
                        var happyBucket = [];
                        var pumpedBucket = [];
                        var relaxingBucket = [];
                        var sadBucket = [];

                        top20[9]['Lyrics'] = lyrics;
                        top20[9]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[9]['Number Of Words'] = countWords(lyrics);
                        top20[9]['Mood'] = getMood(top20[9]);

                        //checking the moods of the various songs
                        if (top20[1]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[1]);
                        }
                        if (top20[1]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[1]);
                        }
                        if (top20[1]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[1]);
                        }
                        if (top20[1]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[1]);
                        }

                        if (top20[2]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[2]);
                        }
                        if (top20[2]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[2]);
                        }
                        if (top20[2]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[2]);
                        }
                        if (top20[2]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[2]);
                        }

                        if (top20[3]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[3]);
                        }
                        if (top20[3]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[3]);
                        }
                        if (top20[3]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[3]);
                        }
                        if (top20[3]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[3]);
                        }

                        if (top20[4]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[4]);
                        }
                        if (top20[4]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[4]);
                        }
                        if (top20[4]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[4]);
                        }
                        if (top20[4]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[4]);
                        }

                        if (top20[5]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[5]);
                        }
                        if (top20[5]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[5]);
                        }
                        if (top20[5]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[5]);
                        }
                        if (top20[5]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[5]);
                        }

                        if (top20[6]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[6]);
                        }
                        if (top20[6]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[6]);
                        }
                        if (top20[6]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[6]);
                        }
                        if (top20[6]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[6]);
                        }

                        if (top20[8]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[8]);
                        }
                        if (top20[8]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[8]);
                        }
                        if (top20[8]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[8]);
                        }
                        if (top20[8]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[8]);
                        }

                        if (top20[9]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[9]);
                        }
                        if (top20[9]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[9]);
                        }
                        if (top20[9]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[9]);
                        }
                        if (top20[9]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[9]);
                        }

                        if (top20[0]['Mood']) {
                            if (top20[0]['Mood'].indexOf('Happy') > -1) {
                                happyBucket.push(top20[0]);
                            }
                            if (top20[0]['Mood'].indexOf('Pumped') > -1) {
                                pumpedBucket.push(top20[0]);
                            }
                            if (top20[0]['Mood'].indexOf('Relaxing') > -1) {
                                relaxingBucket.push(top20[0]);
                            }
                            if (top20[0]['Mood'].indexOf('Sad') > -1) {
                                sadBucket.push(top20[0]);
                            }
                        }

                        if (top20[7]['Mood']) {
                            if (top20[7]['Mood'].indexOf('Happy') > -1) {
                                happyBucket.push(top20[7]);
                            }
                            if (top20[7]['Mood'].indexOf('Pumped') > -1) {
                                pumpedBucket.push(top20[7]);
                            }
                            if (top20[7]['Mood'].indexOf('Relaxing') > -1) {
                                relaxingBucket.push(top20[7]);
                            }
                            if (top20[7]['Mood'].indexOf('Sad') > -1) {
                                sadBucket.push(top20[7]);
                            }
                        }

                        res.render('mood', {
                            mood: 'Pumped',
                            happy: pumpedBucket,
                            happyNum: pumpedBucket.length
                        });
                    });
                });
        }
    });
});

router.get('/happy', function(req, res, next) {
    var jsonMusic = [];
    var top20 = [];

    //recieving 10 songs from spotify's top 200 world songs, this way the songs are both popular by a vast number of people and are chosen somewhat randomly and are indifferent to my taste in music
    request.get('https://spotifycharts.com/regional/global/daily/latest/download', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var csvStr = body;

            //spotify returns a csv file, so I must convert it to a json object
            //for easier management
            csv()
                .fromString(csvStr)
                .on('json', (jsonObj) => {
                    jsonMusic.push(jsonObj);
                })
                .on('done', () => {
                    top20 = jsonMusic.slice(0, 10);

                    //deleating some fields that arent pertinent to this project
                    top20.forEach(function(item) {
                        delete item.Position;
                        delete item.Streams;
                        delete item.URL;
                    });

                    //due to the fact that I'm only analyzing 10 songs I decided to analyze each one instead of using any sort of loop for efficiency
                    getLyrics(top20, 0, function(lyrics) {
                        top20[0]['Lyrics'] = lyrics;
                        top20[0]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[0]['Number Of Words'] = countWords(lyrics);
                        top20[0]['Mood'] = getMood(top20[0]);
                    });

                    getLyrics(top20, 1, function(lyrics) {
                        top20[1]['Lyrics'] = lyrics;
                        top20[1]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[1]['Number Of Words'] = countWords(lyrics);
                        top20[1]['Mood'] = getMood(top20[1]);
                    });

                    getLyrics(top20, 2, function(lyrics) {
                        top20[2]['Lyrics'] = lyrics;
                        top20[2]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[2]['Number Of Words'] = countWords(lyrics);
                        top20[2]['Mood'] = getMood(top20[2]);
                    });

                    getLyrics(top20, 3, function(lyrics) {
                        top20[3]['Lyrics'] = lyrics;
                        top20[3]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[3]['Number Of Words'] = countWords(lyrics);
                        top20[3]['Mood'] = getMood(top20[3]);
                    });

                    getLyrics(top20, 4, function(lyrics) {
                        top20[4]['Lyrics'] = lyrics;
                        top20[4]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[4]['Number Of Words'] = countWords(lyrics);
                        top20[4]['Mood'] = getMood(top20[4]);
                    });

                    getLyrics(top20, 5, function(lyrics) {
                        top20[5]['Lyrics'] = lyrics;
                        top20[5]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[5]['Number Of Words'] = countWords(lyrics);
                        top20[5]['Mood'] = getMood(top20[5]);
                    });

                    getLyrics(top20, 6, function(lyrics) {
                        top20[6]['Lyrics'] = lyrics;
                        top20[6]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[6]['Number Of Words'] = countWords(lyrics);
                        top20[6]['Mood'] = getMood(top20[6]);
                    });

                    getLyrics(top20, 7, function(lyrics) {
                        top20[7]['Lyrics'] = lyrics;
                        top20[7]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[7]['Number Of Words'] = countWords(lyrics);
                        top20[7]['Mood'] = getMood(top20[7]);
                    });

                    getLyrics(top20, 8, function(lyrics) {
                        top20[8]['Lyrics'] = lyrics;
                        top20[8]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[8]['Number Of Words'] = countWords(lyrics);
                        top20[8]['Mood'] = getMood(top20[8]);
                    });

                    getLyrics(top20, 9, function(lyrics) {
                        var happyBucket = [];
                        var pumpedBucket = [];
                        var relaxingBucket = [];
                        var sadBucket = [];

                        top20[9]['Lyrics'] = lyrics;
                        top20[9]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[9]['Number Of Words'] = countWords(lyrics);
                        top20[9]['Mood'] = getMood(top20[9]);

                        //checking the moods of the various songs
                        if (top20[1]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[1]);
                        }
                        if (top20[1]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[1]);
                        }
                        if (top20[1]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[1]);
                        }
                        if (top20[1]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[1]);
                        }

                        if (top20[2]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[2]);
                        }
                        if (top20[2]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[2]);
                        }
                        if (top20[2]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[2]);
                        }
                        if (top20[2]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[2]);
                        }

                        if (top20[3]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[3]);
                        }
                        if (top20[3]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[3]);
                        }
                        if (top20[3]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[3]);
                        }
                        if (top20[3]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[3]);
                        }

                        if (top20[4]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[4]);
                        }
                        if (top20[4]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[4]);
                        }
                        if (top20[4]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[4]);
                        }
                        if (top20[4]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[4]);
                        }

                        if (top20[5]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[5]);
                        }
                        if (top20[5]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[5]);
                        }
                        if (top20[5]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[5]);
                        }
                        if (top20[5]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[5]);
                        }

                        if (top20[6]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[6]);
                        }
                        if (top20[6]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[6]);
                        }
                        if (top20[6]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[6]);
                        }
                        if (top20[6]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[6]);
                        }

                        if (top20[8]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[8]);
                        }
                        if (top20[8]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[8]);
                        }
                        if (top20[8]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[8]);
                        }
                        if (top20[8]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[8]);
                        }

                        if (top20[9]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[9]);
                        }
                        if (top20[9]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[9]);
                        }
                        if (top20[9]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[9]);
                        }
                        if (top20[9]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[9]);
                        }

                        if (top20[0]['Mood']) {
                            if (top20[0]['Mood'].indexOf('Happy') > -1) {
                                happyBucket.push(top20[0]);
                            }
                            if (top20[0]['Mood'].indexOf('Pumped') > -1) {
                                pumpedBucket.push(top20[0]);
                            }
                            if (top20[0]['Mood'].indexOf('Relaxing') > -1) {
                                relaxingBucket.push(top20[0]);
                            }
                            if (top20[0]['Mood'].indexOf('Sad') > -1) {
                                sadBucket.push(top20[0]);
                            }
                        }

                        if (top20[7]['Mood']) {
                            if (top20[7]['Mood'].indexOf('Happy') > -1) {
                                happyBucket.push(top20[7]);
                            }
                            if (top20[7]['Mood'].indexOf('Pumped') > -1) {
                                pumpedBucket.push(top20[7]);
                            }
                            if (top20[7]['Mood'].indexOf('Relaxing') > -1) {
                                relaxingBucket.push(top20[7]);
                            }
                            if (top20[7]['Mood'].indexOf('Sad') > -1) {
                                sadBucket.push(top20[7]);
                            }
                        }

                        console.log(happyBucket);

                        res.render('mood', {
                            mood: 'Happy',
                            happy: happyBucket,
                            happyNum: happyBucket.length
                        });
                    });
                });
        }
    });
});

router.get('/relaxing', function(req, res, next) {
    var jsonMusic = [];
    var top20 = [];

    //recieving 10 songs from spotify's top 200 world songs, this way the songs are both popular by a vast number of people and are chosen somewhat randomly and are indifferent to my taste in music
    request.get('https://spotifycharts.com/regional/global/daily/latest/download', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var csvStr = body;

            //spotify returns a csv file, so I must convert it to a json object
            //for easier management
            csv()
                .fromString(csvStr)
                .on('json', (jsonObj) => {
                    jsonMusic.push(jsonObj);
                })
                .on('done', () => {
                    top20 = jsonMusic.slice(0, 10);

                    //deleating some fields that arent pertinent to this project
                    top20.forEach(function(item) {
                        delete item.Position;
                        delete item.Streams;
                        delete item.URL;
                    });

                    //due to the fact that I'm only analyzing 10 songs I decided to analyze each one instead of using any sort of loop for efficiency
                    getLyrics(top20, 0, function(lyrics) {
                        top20[0]['Lyrics'] = lyrics;
                        top20[0]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[0]['Number Of Words'] = countWords(lyrics);
                        top20[0]['Mood'] = getMood(top20[0]);
                    });

                    getLyrics(top20, 1, function(lyrics) {
                        top20[1]['Lyrics'] = lyrics;
                        top20[1]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[1]['Number Of Words'] = countWords(lyrics);
                        top20[1]['Mood'] = getMood(top20[1]);
                    });

                    getLyrics(top20, 2, function(lyrics) {
                        top20[2]['Lyrics'] = lyrics;
                        top20[2]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[2]['Number Of Words'] = countWords(lyrics);
                        top20[2]['Mood'] = getMood(top20[2]);
                    });

                    getLyrics(top20, 3, function(lyrics) {
                        top20[3]['Lyrics'] = lyrics;
                        top20[3]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[3]['Number Of Words'] = countWords(lyrics);
                        top20[3]['Mood'] = getMood(top20[3]);
                    });

                    getLyrics(top20, 4, function(lyrics) {
                        top20[4]['Lyrics'] = lyrics;
                        top20[4]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[4]['Number Of Words'] = countWords(lyrics);
                        top20[4]['Mood'] = getMood(top20[4]);
                    });

                    getLyrics(top20, 5, function(lyrics) {
                        top20[5]['Lyrics'] = lyrics;
                        top20[5]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[5]['Number Of Words'] = countWords(lyrics);
                        top20[5]['Mood'] = getMood(top20[5]);
                    });

                    getLyrics(top20, 6, function(lyrics) {
                        top20[6]['Lyrics'] = lyrics;
                        top20[6]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[6]['Number Of Words'] = countWords(lyrics);
                        top20[6]['Mood'] = getMood(top20[6]);
                    });

                    getLyrics(top20, 7, function(lyrics) {
                        top20[7]['Lyrics'] = lyrics;
                        top20[7]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[7]['Number Of Words'] = countWords(lyrics);
                        top20[7]['Mood'] = getMood(top20[7]);
                    });

                    getLyrics(top20, 8, function(lyrics) {
                        top20[8]['Lyrics'] = lyrics;
                        top20[8]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[8]['Number Of Words'] = countWords(lyrics);
                        top20[8]['Mood'] = getMood(top20[8]);
                    });

                    getLyrics(top20, 9, function(lyrics) {
                        var happyBucket = [];
                        var pumpedBucket = [];
                        var relaxingBucket = [];
                        var sadBucket = [];

                        top20[9]['Lyrics'] = lyrics;
                        top20[9]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[9]['Number Of Words'] = countWords(lyrics);
                        top20[9]['Mood'] = getMood(top20[9]);

                        //checking the moods of the various songs
                        if (top20[1]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[1]);
                        }
                        if (top20[1]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[1]);
                        }
                        if (top20[1]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[1]);
                        }
                        if (top20[1]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[1]);
                        }

                        if (top20[2]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[2]);
                        }
                        if (top20[2]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[2]);
                        }
                        if (top20[2]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[2]);
                        }
                        if (top20[2]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[2]);
                        }

                        if (top20[3]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[3]);
                        }
                        if (top20[3]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[3]);
                        }
                        if (top20[3]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[3]);
                        }
                        if (top20[3]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[3]);
                        }

                        if (top20[4]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[4]);
                        }
                        if (top20[4]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[4]);
                        }
                        if (top20[4]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[4]);
                        }
                        if (top20[4]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[4]);
                        }

                        if (top20[5]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[5]);
                        }
                        if (top20[5]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[5]);
                        }
                        if (top20[5]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[5]);
                        }
                        if (top20[5]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[5]);
                        }

                        if (top20[6]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[6]);
                        }
                        if (top20[6]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[6]);
                        }
                        if (top20[6]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[6]);
                        }
                        if (top20[6]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[6]);
                        }

                        if (top20[8]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[8]);
                        }
                        if (top20[8]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[8]);
                        }
                        if (top20[8]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[8]);
                        }
                        if (top20[8]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[8]);
                        }

                        if (top20[9]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[9]);
                        }
                        if (top20[9]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[9]);
                        }
                        if (top20[9]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[9]);
                        }
                        if (top20[9]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[9]);
                        }

                        if (top20[0]['Mood']) {
                            if (top20[0]['Mood'].indexOf('Happy') > -1) {
                                happyBucket.push(top20[0]);
                            }
                            if (top20[0]['Mood'].indexOf('Pumped') > -1) {
                                pumpedBucket.push(top20[0]);
                            }
                            if (top20[0]['Mood'].indexOf('Relaxing') > -1) {
                                relaxingBucket.push(top20[0]);
                            }
                            if (top20[0]['Mood'].indexOf('Sad') > -1) {
                                sadBucket.push(top20[0]);
                            }
                        }

                        if (top20[7]['Mood']) {
                            if (top20[7]['Mood'].indexOf('Happy') > -1) {
                                happyBucket.push(top20[7]);
                            }
                            if (top20[7]['Mood'].indexOf('Pumped') > -1) {
                                pumpedBucket.push(top20[7]);
                            }
                            if (top20[7]['Mood'].indexOf('Relaxing') > -1) {
                                relaxingBucket.push(top20[7]);
                            }
                            if (top20[7]['Mood'].indexOf('Sad') > -1) {
                                sadBucket.push(top20[7]);
                            }
                        }

                        res.render('mood', {
                            mood: 'Relaxing',
                            happy: relaxingBucket,
                            happyNum: relaxingBucket.length
                        });
                    });
                });
        }
    });
});

router.get('/sad', function(req, res, next) {
    var jsonMusic = [];
    var top20 = [];

    //recieving 10 songs from spotify's top 200 world songs, this way the songs are both popular by a vast number of people and are chosen somewhat randomly and are indifferent to my taste in music
    request.get('https://spotifycharts.com/regional/global/daily/latest/download', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var csvStr = body;

            //spotify returns a csv file, so I must convert it to a json object
            //for easier management
            csv()
                .fromString(csvStr)
                .on('json', (jsonObj) => {
                    jsonMusic.push(jsonObj);
                })
                .on('done', () => {
                    top20 = jsonMusic.slice(0, 10);

                    //deleating some fields that arent pertinent to this project
                    top20.forEach(function(item) {
                        delete item.Position;
                        delete item.Streams;
                        delete item.URL;
                    });

                    //due to the fact that I'm only analyzing 10 songs I decided to analyze each one instead of using any sort of loop for efficiency
                    getLyrics(top20, 0, function(lyrics) {
                        top20[0]['Lyrics'] = lyrics;
                        top20[0]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[0]['Number Of Words'] = countWords(lyrics);
                        top20[0]['Mood'] = getMood(top20[0]);
                    });

                    getLyrics(top20, 1, function(lyrics) {
                        top20[1]['Lyrics'] = lyrics;
                        top20[1]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[1]['Number Of Words'] = countWords(lyrics);
                        top20[1]['Mood'] = getMood(top20[1]);
                    });

                    getLyrics(top20, 2, function(lyrics) {
                        top20[2]['Lyrics'] = lyrics;
                        top20[2]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[2]['Number Of Words'] = countWords(lyrics);
                        top20[2]['Mood'] = getMood(top20[2]);
                    });

                    getLyrics(top20, 3, function(lyrics) {
                        top20[3]['Lyrics'] = lyrics;
                        top20[3]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[3]['Number Of Words'] = countWords(lyrics);
                        top20[3]['Mood'] = getMood(top20[3]);
                    });

                    getLyrics(top20, 4, function(lyrics) {
                        top20[4]['Lyrics'] = lyrics;
                        top20[4]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[4]['Number Of Words'] = countWords(lyrics);
                        top20[4]['Mood'] = getMood(top20[4]);
                    });

                    getLyrics(top20, 5, function(lyrics) {
                        top20[5]['Lyrics'] = lyrics;
                        top20[5]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[5]['Number Of Words'] = countWords(lyrics);
                        top20[5]['Mood'] = getMood(top20[5]);
                    });

                    getLyrics(top20, 6, function(lyrics) {
                        top20[6]['Lyrics'] = lyrics;
                        top20[6]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[6]['Number Of Words'] = countWords(lyrics);
                        top20[6]['Mood'] = getMood(top20[6]);
                    });

                    getLyrics(top20, 7, function(lyrics) {
                        top20[7]['Lyrics'] = lyrics;
                        top20[7]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[7]['Number Of Words'] = countWords(lyrics);
                        top20[7]['Mood'] = getMood(top20[7]);
                    });

                    getLyrics(top20, 8, function(lyrics) {
                        top20[8]['Lyrics'] = lyrics;
                        top20[8]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[8]['Number Of Words'] = countWords(lyrics);
                        top20[8]['Mood'] = getMood(top20[8]);
                    });

                    getLyrics(top20, 9, function(lyrics) {
                        var happyBucket = [];
                        var pumpedBucket = [];
                        var relaxingBucket = [];
                        var sadBucket = [];

                        top20[9]['Lyrics'] = lyrics;
                        top20[9]['Sentiment Analysis'] = getSentimentScore(lyrics);
                        top20[9]['Number Of Words'] = countWords(lyrics);
                        top20[9]['Mood'] = getMood(top20[9]);

                        //checking the moods of the various songs
                        if (top20[1]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[1]);
                        }
                        if (top20[1]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[1]);
                        }
                        if (top20[1]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[1]);
                        }
                        if (top20[1]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[1]);
                        }

                        if (top20[2]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[2]);
                        }
                        if (top20[2]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[2]);
                        }
                        if (top20[2]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[2]);
                        }
                        if (top20[2]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[2]);
                        }

                        if (top20[3]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[3]);
                        }
                        if (top20[3]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[3]);
                        }
                        if (top20[3]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[3]);
                        }
                        if (top20[3]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[3]);
                        }

                        if (top20[4]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[4]);
                        }
                        if (top20[4]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[4]);
                        }
                        if (top20[4]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[4]);
                        }
                        if (top20[4]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[4]);
                        }

                        if (top20[5]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[5]);
                        }
                        if (top20[5]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[5]);
                        }
                        if (top20[5]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[5]);
                        }
                        if (top20[5]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[5]);
                        }

                        if (top20[6]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[6]);
                        }
                        if (top20[6]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[6]);
                        }
                        if (top20[6]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[6]);
                        }
                        if (top20[6]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[6]);
                        }

                        if (top20[8]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[8]);
                        }
                        if (top20[8]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[8]);
                        }
                        if (top20[8]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[8]);
                        }
                        if (top20[8]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[8]);
                        }

                        if (top20[9]['Mood'].indexOf('Happy') > -1) {
                            happyBucket.push(top20[9]);
                        }
                        if (top20[9]['Mood'].indexOf('Pumped') > -1) {
                            pumpedBucket.push(top20[9]);
                        }
                        if (top20[9]['Mood'].indexOf('Relaxing') > -1) {
                            relaxingBucket.push(top20[9]);
                        }
                        if (top20[9]['Mood'].indexOf('Sad') > -1) {
                            sadBucket.push(top20[9]);
                        }

                        if (top20[0]['Mood']) {
                            if (top20[0]['Mood'].indexOf('Happy') > -1) {
                                happyBucket.push(top20[0]);
                            }
                            if (top20[0]['Mood'].indexOf('Pumped') > -1) {
                                pumpedBucket.push(top20[0]);
                            }
                            if (top20[0]['Mood'].indexOf('Relaxing') > -1) {
                                relaxingBucket.push(top20[0]);
                            }
                            if (top20[0]['Mood'].indexOf('Sad') > -1) {
                                sadBucket.push(top20[0]);
                            }
                        }

                        if (top20[7]['Mood']) {
                            if (top20[7]['Mood'].indexOf('Happy') > -1) {
                                happyBucket.push(top20[7]);
                            }
                            if (top20[7]['Mood'].indexOf('Pumped') > -1) {
                                pumpedBucket.push(top20[7]);
                            }
                            if (top20[7]['Mood'].indexOf('Relaxing') > -1) {
                                relaxingBucket.push(top20[7]);
                            }
                            if (top20[7]['Mood'].indexOf('Sad') > -1) {
                                sadBucket.push(top20[7]);
                            }
                        }

                        res.render('mood', {
                            mood: 'Sad',
                            happy: sadBucket,
                            happyNum: sadBucket.length
                        });
                    });
                });
        }
    });
})

module.exports = router;
