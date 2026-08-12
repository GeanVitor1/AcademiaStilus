import { Component } from '@angular/core';
import { About } from '../../components/about/about';
import { Facilities } from '../../components/facilities/facilities';
import { Hero } from '../../components/hero/hero';
import { Location } from '../../components/location/location';
import { Modalities } from '../../components/modalities/modalities';
import { Products } from '../../components/products/products';
import { Rules } from '../../components/rules/rules';
import { Teachers } from '../../components/teachers/teachers';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, About, Modalities, Teachers, Facilities, Products, Rules, Location],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
