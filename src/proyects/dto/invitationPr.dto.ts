import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectInvitationDto{
    @IsInt()
    @IsNotEmpty()
    idProject: number;

    @IsInt()
    @IsNotEmpty()
    idUser: number;

    @IsString()
    @IsNotEmpty()
    codeTeam: string;
}

export class RespondInvitationDto{
    @IsInt()
    @IsNotEmpty()
    idInvitation: number;

    @IsString()
    @IsNotEmpty()
    response: string;

    @IsInt()
    @IsNotEmpty()
    idUser: number;
}