import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseIcon from '@mui/icons-material/Pause';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import {useContext,memo} from "react";
import {MainContext} from "./App";

const SingleVideo = memo(({video,togglePlayPause}) => {
    console.log("App > VideoPlayer > VideoList > SingleVideo");
    return(
        <ListItem sx={{p:2}} secondaryAction={
            <IconButton sx={{p:2}} onClick={() => togglePlayPause(video)} edge="end" aria-label="play-pause">
              {video.playState == 'play' ? <PauseIcon />:<PlayCircleOutlineIcon />}
            </IconButton>
          }>
          <ListItemAvatar>
            <Avatar alt={video.name} src={`/videos/${video.cover}`}></Avatar>
          </ListItemAvatar>
          <ListItemText primary={video.name} />
        </ListItem>
    )
})

const VideoList = () => {
    console.log("App > VideoPlayer > VideoList");
    const {mode,videos,togglePlayPause} = useContext(MainContext);
    return(
      <Box
        sx={{
        width: '95%',
        maxWidth:600,
        margin:'20px auto',
        borderRadius: '5px',
        bgcolor: mode === 'dark' ? 'black':'aliceblue'
        }}
      >
        <List sx={{ width: '100%' }}>
          {videos.map((video) => <SingleVideo key={video.id} video={video} togglePlayPause={togglePlayPause} />)}
        </List>
      </Box>
    )
}
export default memo(VideoList);