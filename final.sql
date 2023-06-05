CREATE TABLE User(
    User_ID int auto_increment,
    username VARCHAR(20),
    password VARCHAR(20),
    favorite_genre_id int,
    primary key(User_ID),
    foreign key(favorite_genre_id) references Genre(Genre_ID)
)

CREATE TABLE Rating(
    Rating_ID int auto_increment,
    Scale int,
    Review VARCHAR,
    Movie_ID int,
    User_ID int,
    primary key(Rating_ID),
    foreign key(User_ID) references User(User_ID),
    foreign key(Movie_ID) references Movie(Movie_ID)
)

SELECT book.title, borrowed.member_id, borrowed.date
FROM book
LEFT JOIN borrowed
ON book.ISBN = borrowed.ISBN


SELECT book.title, borrowed.member_id,borrowed.date
FROM book
RIGHT JOIN borrowed
ON book.ISBN = borrowed.ISBN

SELECT COUNT(*)
FROM borrowed
JOIN member_id
ON borrowed.member_id = member.member_id
WHERE member.name = 'Ali Smith'


SELECT member.name, member.member_id
FROM member
JOIN borrowed
ON member.member_id = borrowed.member_id
GROUP BY member.name HAVING count(*) >20

SELECT borrowed.ISBN, member.authors,book.publisher
FROM borrowed JOIN book
ON borrowed.ISBN = book.ISBN
WHERE book = 'UoL Press'
GROUP BY borrowed.ISBN having count(borrowed.date) > 10


