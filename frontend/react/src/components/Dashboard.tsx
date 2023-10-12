import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Box } from '@mui/material';


export function Dashboard() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', height: '100vh' }}>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image="https://th.bing.com/th/id/R.3f7d964c48be6509da50d3396efc8514?rik=zEYqxFaZDGwoMQ&riu=http%3a%2f%2f1.bp.blogspot.com%2f-MXctD4ErbT8%2fUxrU3wNfnkI%2fAAAAAAAAAGw%2ffmdP5wboigA%2fs1600%2fHdhut.blogspot%2b%25252815%252529.jpg&ehk=xV7lrJKTT2%2fnYQUVNoxnM42dHs9DZheKz1xSq2BJrKI%3d&risl=&pid=ImgRaw&r=0"
          title="green lizard"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Lizard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image="https://th.bing.com/th/id/R.dc0489491cb4dcf02d35839333e450c2?rik=6TIeb3W2peQ0fw&riu=http%3a%2f%2f3.bp.blogspot.com%2f-dui-f0hQUHE%2fU0Qs5dOcWII%2fAAAAAAAACpg%2fS1lb9AnsMU4%2fs1600%2floveable-cat-wallpaper-free.jpg&ehk=v0niYfmZzZONVgNw4o0N9ktIw1%2bOfTsRrQTqp0KJKnI%3d&risl=&pid=ImgRaw&r=0"
          title="cats"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Cat
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The cat (Felis catus) is a domestic species of small carnivorous mammal. It is the only domesticated species in the family Felidae and is commonly referred to as the domestic cat or house cat to distinguish it from the wild members of the family. Cats are commonly kept as house pets but can also be farm cats or feral cats; the feral cat ranges freely and avoids human contact. Domestic cats are valued by humans for companionship and their ability to kill vermin. About 60 cat breeds are recognized by various cat registries.
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image="https://th.bing.com/th/id/R.a8b73b08a0354a706f00d3f24dee7378?rik=NWjjYn0emvfGOg&riu=http%3a%2f%2fhdqwalls.com%2fdownload%2f1%2fcolorful-parrot-bird.jpg&ehk=TueFyYK%2fTrLpzkimOSJEWLrgPGU%2fv%2bwcWxmK%2bdIZftk%3d&risl=&pid=ImgRaw&r=0"
          title="birds"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Bird
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Birds are a group of warm-blooded vertebrates constituting the class Aves, characterised by feathers, toothless beaked jaws, the laying of hard-shelled eggs, a high metabolic rate, a four-chambered heart, and a strong yet lightweight skeleton.
            Birds live worldwide and range in size from the 5.5 cm (2.2 in) bee hummingbird to the 2.8 m (9 ft 2 in) common ostrich.
            There are about ten thousand living species, more than half of which are passerine, or "perching" birds. Birds have wings whose development varies according to species; the only known groups without wings are the extinct moa and elephant birds.
            Wings, which are modified forelimbs, gave birds the ability to fly, although further evolution has led to the loss of flight in some birds, including ratites, penguins, and diverse endemic island species.
            The digestive and respiratory systems of birds are also uniquely adapted for flight. Some bird species of aquatic environments, particularly seabirds and some waterbirds, have further evolved for swimming.
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Box>
  );
}




