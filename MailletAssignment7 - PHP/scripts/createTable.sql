use albumsdb;
create table Albums
(
	id int not null auto_increment primary key,
    title varchar(50) not null,
    artist varchar(50) not null,
    genre varchar(20) not null,
    releaseYear int not null
);