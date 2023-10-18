import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import VideoList from "./VideoList";
import IconButton from '@mui/material/IconButton';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import {useState,useRef,useEffect,useContext,memo} from "react";
import {MainContext} from "./App";
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

const TinyText = styled(Typography)({
    fontSize: '0.75rem',
    opacity: 0.38,
    fontWeight: 500,
    letterSpacing: 0.2,
});

const formatDuration = (value) => {
    const minute = Math.floor(value / 60);
    const secondLeft = (value - minute * 60).toString().split(".")[0];
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}

const VideoPlayerSlider = memo(({videoRef,mode,cur_video,changeVideo}) => {
    console.log("App > VideoPlayer > VideoBox > VideoPlayerSlider");
    const [currentPosition, setCurrentPosition] = useState(0);
    useEffect(() => {
        const video = videoRef.current;
        const handleTimeUpdate = () => setCurrentPosition(video.currentTime);
        video.addEventListener('timeupdate',handleTimeUpdate);
        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    },[]);
    useEffect(() => {
        const video = videoRef.current;
        cur_video.playState == 'play' ? video.play(): video.pause();
        const handelNextVideo = () => changeVideo("next");
        video.addEventListener('ended',handelNextVideo);
        return () => {
            video.removeEventListener('ended', handelNextVideo);
        }
    },[cur_video]);
    let duration = videoRef.current ? videoRef.current.duration : 0;
    duration = !isNaN(duration) ? duration:0;
    const seekTo = (positionInSeconds) => {
        if(videoRef.current){
            videoRef.current.currentTime = positionInSeconds;
            setCurrentPosition(positionInSeconds);
        }
    };
    return(
        <>
            <Slider
                aria-label="time-indicator"
                size="small"
                value={currentPosition}
                min={0}
                step={1}
                max={duration}
                onChange={(_, value) => seekTo(value)}
                sx={{
                    color: mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
                    height: 4,
                    '& .MuiSlider-thumb': {
                    width: 8,
                    height: 8,
                    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                    '&:before': {
                        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                    },
                    '&:hover, &.Mui-focusVisible': {
                        boxShadow: `0px 0px 0px 8px ${
                        mode === 'dark'
                            ? 'rgb(255 255 255 / 16%)'
                            : 'rgb(0 0 0 / 16%)'
                        }`,
                    },
                    '&.Mui-active': {
                        width: 20,
                        height: 20,
                    },
                    },
                    '& .MuiSlider-rail': {
                    opacity: 0.28,
                    },
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: -2,
                }}
                >
                <TinyText>{formatDuration(currentPosition)}</TinyText>
                <TinyText>-{formatDuration(duration - currentPosition)}</TinyText>
            </Box>
        </>
    )
})

const VideoBox = () => {
    console.log("App > VideoPlayer > VideoBox");
    const {mode,videos,togglePlayPause} = useContext(MainContext);
    const videoRef = useRef();
    let mainIconColor = mode === 'dark' ? '#fff':'#000';
    const cur_video = videos.filter(obj => ['play','pause'].includes(obj.playState))[0] || videos[0];
    const changeVideo = (dir) => {
        let ind = cur_video.id - 1;
        if(dir == "next"){
            ind++;
            if(ind >= videos.length){ ind = 0 }
        }else{
            ind--;
            if(ind < 0){ ind = videos.length - 1 }
        }
        togglePlayPause(videos[ind]);
    }
    const video_width = window.innerWidth < 600 ? {width:'100%'}:{width:'auto'};
    return(
        <>
            <video style={video_width} ref={videoRef} title={cur_video.name} src={`/videos/${cur_video.path}`} poster={`/videos/${cur_video.cover}`}></video>
            <VideoPlayerSlider changeVideo={changeVideo} cur_video={cur_video} mode={mode} videoRef={videoRef} />
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: -1,
                }}
                >
                <IconButton onClick={() => changeVideo("prev")} aria-label="previous song">
                    <FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
                </IconButton>
                <IconButton
                    aria-label={['stop','pause'].includes(cur_video.playState) ? 'play' : 'pause'}
                    onClick={() => togglePlayPause(cur_video)}
                >
                    {['stop','pause'].includes(cur_video.playState) ? (
                    <PlayArrowRounded
                        sx={{ fontSize: '3rem' }}
                        htmlColor={mainIconColor}
                    />
                    ) : (
                    <PauseRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
                    )}
                </IconButton>
                <IconButton onClick={() => changeVideo("next")} aria-label="next song">
                    <FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
                </IconButton>
            </Box>
        </>
    )
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'black' : 'aliceblue',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const VideoPlayer = () => {
    console.log("App > VideoPlayer");
    return(
        <Box sx={{ flexGrow: 1,m:"20px auto", maxWidth:1500 }}>
            <Grid container spacing={2}>
                <Grid item md={8} xs={12}>
                    <Item><VideoBox /></Item>
                </Grid>
                <Grid item md={4} xs={12}>
                    <Item><VideoList /></Item>
                </Grid>
            </Grid>
        </Box>
    )
}
export default VideoPlayer;