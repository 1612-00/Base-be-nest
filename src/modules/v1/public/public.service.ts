import { Injectable } from '@nestjs/common';
import { AboutUsService } from '@v1/about-us/about-us.service';
import { ClientsService } from '@v1/admin/clients/clients.service';
import { MembersService } from '@v1/admin/members/members.service';
import { NewsService } from '@v1/admin/news/news.service';
import { ProjectsService } from '@v1/admin/projects/projects.service';
import { TeamsService } from '@v1/admin/teams/teams.service';
import { TechStacksService } from '@v1/admin/tech-stacks/tech-stacks.service';
import { TechStackGroupService } from '@v1/admin/techStackGroup/techStackGroup.service';
import { FoldersService } from '@v1/folders/folders.service';
import { HomeConfigService } from '@v1/home-config/home-config.service';
import { PhotosService } from '@v1/photos/photos.service';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';

@Injectable()
export class PublicService {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly membersService: MembersService,
    private readonly aboutUsService: AboutUsService,
    private readonly photosService: PhotosService,
    private readonly foldersService: FoldersService,
    private readonly techStackGroupService: TechStackGroupService,
    private readonly techStackService: TechStacksService,
    private readonly newsService: NewsService,
    private readonly homeConfigService: HomeConfigService,
    private readonly projectsService: ProjectsService,
    private readonly clientsService: ClientsService,
  ) {}

  // Teams
  async getTeams() {
    return await this.teamsService.getAllTeams();
  }

  async getTeamsPaginate(paginate: PaginateQuery) {
    return await this.teamsService.getAllTeamsPaginate(paginate);
  }

  async getTeamById(id: string) {
    return await this.teamsService.getTeamById(id);
  }

  // Members
  async getMembers() {
    return await this.membersService.getAll();
  }

  async getMembersPaginate(paginate: PaginateQuery) {
    return await this.membersService.getAllPaginate(paginate);
  }

  async getMemberById(id: string) {
    return await this.membersService.getById(id);
  }

  // About Us
  async getAboutUs() {
    return await this.aboutUsService.getAboutUs();
  }

  // Photos
  async getPhotos() {
    return await this.photosService.getAll();
  }

  async getPhotosPaginate(paginate: PaginateQuery) {
    return await this.photosService.getAllPaginate(paginate);
  }

  async getPhotoById(id: string) {
    return await this.photosService.getById(id);
  }

  // Folders
  async getFolders() {
    return await this.foldersService.getAll();
  }

  async getFoldersPaginate(paginate: PaginateQuery) {
    return await this.foldersService.getAllPaginate(paginate);
  }

  async getFolderById(id: string) {
    return await this.foldersService.getById(id);
  }

  // Tech Stack Group
  async getTechStackGroup() {
    return await this.techStackGroupService.getAllTechStackGroup();
  }

  async getTechStackGroupById(id: string) {
    return await this.techStackGroupService.getTechStackGroupById(id);
  }

  // Tech Stack
  async getTechStacks() {
    return await this.techStackService.getAll();
  }

  async getTechStacksPaginate(paginate: PaginateQuery) {
    return await this.techStackService.getAllPaginate(paginate);
  }

  async getTechStackById(id: string) {
    return await this.techStackService.getById(id);
  }

  // News
  async getNews() {
    return await this.newsService.findAll();
  }

  async getNewsPaginate(paginate: PaginateQuery) {
    return await this.newsService.findAllPaginate(paginate);
  }

  async getNewById(id: string) {
    return await this.newsService.findOne(id);
  }

  // Home Config
  async getHomeConfig() {
    return await this.homeConfigService.get();
  }

  // Projects
  async getProjects() {
    return await this.projectsService.getAll();
  }

  async getProjectsPaginate(paginate: PaginateQuery) {
    return await this.projectsService.getAllPaginate(paginate);
  }

  async getProjectById(id: string) {
    return await this.projectsService.getById(id);
  }

  // Clients
  async getClients() {
    return await this.clientsService.getAll();
  }

  async getClientsPaginate(paginate: PaginateQuery) {
    return await this.clientsService.getAllPaginate(paginate);
  }

  async getClientById(id: string) {
    return await this.clientsService.getById(id);
  }
}
