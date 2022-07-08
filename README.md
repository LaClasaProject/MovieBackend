# Movie Backend
Backend service for the "Movie" project.
Also serves as a host for the .mp4 files of the movies/series.

## Adding video files
  - Create a folder named `/movies`.  
  - Inside that folder, you can create another folder for each movie/series.
    - The folder name would be the `VideoId` placed in the database.
  
  - Add the .mp4 files in.
    - If the video is a movie, the file name should be `video.mp4`.  
    - If it's a series, create another folder inside it, named `S01`. Where `S` is season, and `01` is the season number.  
      - Examples: `S01`, `S10`, `S02`, `S21`
    - After creating the folder, you can place the `.mp4` file for each episode, where the name would be `E01`.
      - Examples: `E01`, `E10`, `E02`, `E21`