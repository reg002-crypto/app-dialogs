import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import {useEffect, useState} from "react";

import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {FixedSizeList, ListChildComponentProps} from 'react-window';

import {deepOrange, deepPurple} from '@mui/material/colors';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';


function RenderRow(props: ListChildComponentProps) {
    const {index, style} = props;

    return (
        <ListItem style={style} key={index} component="div" disablePadding>
            <ListItemButton>
                <ListItemText primary={`Item ${index + 1}`}/>
            </ListItemButton>
        </ListItem>
    );
}

function VirtualizedList() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return (
        <Box
            sx={{width, height, bgcolor: 'background.paper'}}
        >
            <FixedSizeList
                height={height}
                width={width}
                itemSize={46}
                itemCount={200}
                overscanCount={2}
            >
                {RenderRow}
            </FixedSizeList>
        </Box>
    );
}

let i = 0;
let pulling = false;
let isDown = false;
let pullingStartY = 0;
let pullingEndY = 0;
let pullingOffset = 150;
export default function Chat() {

    const [rows, setRows] = useState(new Array(20).fill(i))
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (!loaded) {
            setLoaded(true)
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, [loaded]);
    useEffect(() => {
        const onScroll = (event: any) => {
            const {clientHeight, scrollHeight, offsetHeight} = document.documentElement;
            if (window.scrollY === 0) {
                console.log('Scroll top ', window.scrollY, {clientHeight, scrollHeight, offsetHeight});
                setTimeout(() => {
                    setRows([...new Array(5).fill(++i), ...rows])
                }, 1400)
            } else if (window.scrollY + clientHeight === scrollHeight) {
                console.log('Scrolling bot', window.scrollY, {clientHeight, scrollHeight, offsetHeight});
                if (loaded) {
                    setTimeout(() => {
                        setRows([...rows, ...new Array(2).fill(++i)])
                    }, 1400)
                }
            }
        }
        const onTouchStart = (event: any) => {
            const {clientHeight, scrollHeight, offsetHeight} = document.documentElement;
            if (event.touches && event.touches.length > 0) {
                if (window.scrollY === 0 || window.scrollY + clientHeight === scrollHeight) {
                    isDown = window.scrollY === 0;
                    pulling = true;
                    pullingStartY = event.touches[0].screenY;
                    console.log("pulling 1",)
                }
            }

        }

        const onTouchMove = (event: any) => {
            if (pulling) {
                pullingEndY = event.touches[0].screenY;
            }
        }

        const onTouchEnd = () => {
            if (pulling && Math.abs(pullingStartY - pullingEndY) > pullingOffset) {
                // debugger
                console.log("pulling 4", Math.abs(pullingStartY - pullingEndY))
                setTimeout(() => {
                    if (isDown) {
                        //setRows([...new Array(5).fill(++i),...rows])
                    } else {
                        // setRows([...rows,...new Array(2).fill(++i)])
                    }

                }, 1400)
            }
            if (pulling) {
                pulling = false
            }
        }

        const onTouchCancel = () => {
            pulling = false;
        }
        window.addEventListener('scroll', onScroll);
        window.addEventListener('touchstart', onTouchStart);
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('touchend', onTouchEnd);
        window.addEventListener('touchcancel', onTouchCancel);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('touchcancel', onTouchCancel);
        }
    }, [rows, loaded])

    return (
        <Container maxWidth="sm" sx={{px: 0}}>
            {/*<VirtualizedList />*/}
            <List dense sx={{width: '100%', bgcolor: 'background.paper'}}>
                {
                    rows.map((id, index) => {
                        return <ListItem disablePadding key={index} alignItems="flex-start">
                            <ListItemButton sx={{ '&& .MuiTouchRipple-rippleVisible': {
                                    animationDuration: '200ms',
                                },}}>
                                <ListItemAvatar>
                                    <Avatar sx={{bgcolor: deepOrange[500]}}>{id}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${index} 中文`}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{display: 'inline'}}
                                                component="h2"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                Ali Connors11
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>

                    })
                }
            </List>
        </Container>
    );
}
