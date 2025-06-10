import { UpdateStatus } from './../dto/updateStatus.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/user/user.entity';
import { EUserRole } from 'src/enums/user.enums';
import { GetAllUsersInDto } from '../dto/get-all-users.in.dto';
import { GetAllUsersOutDto } from '../dto/get-all-users.out.dto';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async getAllUsers(query: GetAllUsersInDto): Promise<{ users: GetAllUsersOutDto[], total: number }> {
    const { page = 1, perPage = DEFAULT_PER_PAGE, search, status } = query;

    const qb = this.userRepository.createQueryBuilder('user')
      .where('user.role = :role', { role: EUserRole.USER })
      .addSelect(['user.username', 'user.first_name', 'user.last_name', 'user.email', 'user.phone_number', 'user.avatar_url', 'user.status']);

    if (search) {
      qb.andWhere('user.username LIKE :search OR user.email LIKE :search', { search: `%${search}%` });
    }

    if (status) {
      qb.andWhere('user.status = :status', { status });
    }

    const skip = (page - 1) * perPage;
    const take = perPage;

    const [users, total] = await qb.skip(skip).take(take).getManyAndCount();

    return { users, total };
  }

  async updateUserStatus(
    userId: number,
    updateStatus: UpdateStatus,
  ): Promise<User | null> {
    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!currentUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    currentUser.status = updateStatus.status;

    return this.userRepository.save(currentUser);
  }
}
