CREATE DATABASE sigeas;
USE sigeas;

CREATE TABLE turmas (
	id int not null auto_increment primary key,
    nome varchar(255),
    data_criacao timestamp default current_timestamp
);

CREATE TABLE usuarios (
	id int not null auto_increment primary key,
    nome varchar(255),
    email varchar(255),
    senha varchar(255),
    tipo_conta varchar(255),
    id_turma varchar(255),
    data_criacao timestamp default current_timestamp
);

CREATE TABLE presenca (
	id int not null auto_increment primary key,
    id_aluno int,
    id_turma int,
    id_professor int,
    data date,
    presenca BOOLEAN NOT NULL DEFAULT 0,
    
    foreign key (id_aluno) references usuarios(id) on delete cascade,
    foreign key (id_turma) references turmas(id) on delete cascade,
    foreign key (id_professor) references usuarios(id) on delete cascade,

    UNIQUE KEY uniq_presenca (id_aluno, id_turma, data);
);

CREATE TABLE nota (
	id int not null auto_increment primary key,
    id_aluno int,
    id_turma int,
    id_professor int,
    trimestre int,
    nota_1 decimal(1),
    nota_2 decimal(1),
    media decimal(1),
    
    foreign key (id_aluno) references usuarios(id) on delete cascade,
    foreign key (id_turma) references turmas(id) on delete cascade,
    foreign key (id_professor) references usuarios(id) on delete cascade
);


insert into usuarios(email, senha, tipo_conta) values ("adm@gmail.com", "teste", "adm");