const initialState = {
    mode:'dark',
    videos:[
        {id:1,name:"video 1",cover:"video-1.jpg",path:"video-1.mp4",playState:'stop'},
        {id:2,name:"video 2",cover:"video-2.jpg",path:"video-2.mp4",playState:'stop'},
        {id:3,name:"video 3",cover:"video-3.jpg",path:"video-3.mp4",playState:'stop'},
        {id:4,name:"video 4",cover:"video-4.jpg",path:"video-4.mp4",playState:'stop'},
        {id:5,name:"video 5",cover:"video-5.jpg",path:"video-5.mp4",playState:'stop'}
    ]
}
const reducer = (state,action) => {
    switch(action.type){
        case "TOGGLE_MODE":
            return {...state,mode:action.payload};
        break;
        case "UPDT_PLAYING":
            return {...state,videos:action.payload};
        break;
        default:
            return state;
    }
}
export {reducer,initialState};