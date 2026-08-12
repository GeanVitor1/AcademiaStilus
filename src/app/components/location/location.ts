import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  viewChild,
} from '@angular/core';
import type * as L from 'leaflet';
import { RevealDirective } from '../../directives/reveal.directive';
import { TextRevealDirective } from '../../directives/text-reveal.directive';
import { GYM_ADDRESS, GYM_COORDS, GYM_MAPS_URL, GYM_NAME } from '../../shared/catalog';
import { WhatsAppService } from '../../shared/whatsapp.service';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [RevealDirective, TextRevealDirective],
  templateUrl: './location.html',
  styleUrl: './location.scss',
})
export class Location implements AfterViewInit, OnDestroy {
  readonly address = GYM_ADDRESS;
  readonly coords = GYM_COORDS;
  readonly mapsUrl = GYM_MAPS_URL;
  private readonly wa = inject(WhatsAppService);
  private readonly mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('map');

  private map?: L.Map;
  private resizeObserver?: ResizeObserver;
  private visibilityObserver?: IntersectionObserver;
  private initObserver?: IntersectionObserver;
  private mapInited = false;

  get whatsappUrl(): string {
    return this.wa.contactUrl;
  }

  ngAfterViewInit(): void {
    const el = this.mapContainer().nativeElement;
    if (!('IntersectionObserver' in window)) {
      this.initMap();
      return;
    }
    this.initObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.initObserver?.disconnect();
          this.initMap();
        }
      },
      { rootMargin: '400px 0px' }
    );
    this.initObserver.observe(el);
  }

  private async initMap(): Promise<void> {
    if (this.mapInited) {
      return;
    }
    this.mapInited = true;
    const L = await import('leaflet');

    const el = this.mapContainer().nativeElement;
    const map = L.map(el, {
      center: [this.coords.lat, this.coords.lng],
      zoom: 16,
      scrollWheelZoom: false,
    });

    const tiles = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }
    );
    tiles.addTo(map);

    let swapped = false;
    tiles.on('tileerror', () => {
      if (swapped) return;
      swapped = true;
      tiles.remove();
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
    });

    const icon = L.divIcon({
      className: 'map-pin-wrap',
      html: '<div class="map-pin"></div>',
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });

    L.marker([this.coords.lat, this.coords.lng], { icon })
      .addTo(map)
      .bindPopup(
        `<strong>${GYM_NAME}</strong><br />${GYM_ADDRESS.street}<br />${GYM_ADDRESS.district}`
      );

    const syncSize = () => map.invalidateSize();
    requestAnimationFrame(syncSize);

    this.resizeObserver = new ResizeObserver(() => syncSize());
    this.resizeObserver.observe(el);

    if ('IntersectionObserver' in window) {
      this.visibilityObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              syncSize();
              this.visibilityObserver?.disconnect();
            }
          }
        },
        { threshold: 0 }
      );
      this.visibilityObserver.observe(el);
    }

    this.map = map;
  }

  ngOnDestroy(): void {
    this.initObserver?.disconnect();
    this.visibilityObserver?.disconnect();
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }
}
