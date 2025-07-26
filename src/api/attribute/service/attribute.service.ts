import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attribute } from 'src/database/entities/attribute/attribute.entity';
import { Repository } from 'typeorm';
import { CreateAttributeInDto } from '../dto/create-attribute.in.dto';
import { UpdateAttributeInDto } from '../dto/update-attribute.in.dto';
import { GetAllAttributesInDto } from '../dto/get-all-attributes.in.dto';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
  ) {}

  async create(dto: CreateAttributeInDto): Promise<Attribute> {
    const attribute = this.attributeRepository.create(dto);
    return this.attributeRepository.save(attribute);
  }

  async findAll(query: GetAllAttributesInDto): Promise<{
    attributes: Attribute[];
    total: number;
  }> {
    const { page = 1, perPage = DEFAULT_PER_PAGE } = query;

    const [attributes, total] = await this.attributeRepository.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return { attributes, total };
  }

  async findById(id: number): Promise<Attribute> {
    const attribute = await this.attributeRepository.findOneBy({ id });
    if (!attribute) throw new NotFoundException('Attribute not found');
    return attribute;
  }

  async update(id: number, dto: UpdateAttributeInDto): Promise<Attribute> {
    await this.findById(id); // to throw if not exist
    await this.attributeRepository.update(id, dto);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.findById(id); // to throw if not exist
    await this.attributeRepository.delete(id);
  }
}
