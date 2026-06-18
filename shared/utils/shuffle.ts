import {PlaylistItem} from "../types/Playlist.ts";

// Regexes for track names
const opusRegex = /\bOp\.?\s*(\d+)/i;
const noRegex = /\bNo\.?\s*(\d+)/i;
const catalogRegex = /\b((?:BWV|HWV|RV|KV?|D|S|WWV|Op|Hob)\.?)\s+([IVX0-9]+[a-z]?(?::[0-9]+)?(?:,?\s*No\.?\s*[0-9]+)?)\b/;

/**
 * A list of identifiers used to separate partitions from one another.
 * Each Partition also keeps an array of all the items in it.
 * e.g. tracks with different composers are put into different partitions.
 * These partitions are identifiable by the traits that make them different from another.
 * The goal is for these partitions to represent a whole work/piece.
 */
interface PlaylistPartition {
    discriminators: PartitionDiscriminators;
    items: PlaylistItem[];
}

interface PartitionDiscriminators {
    albumId: string;
    primaryArtistName: string;
    trackNumber: number;
    name: string;
}

interface ClassicalHeuristics {
    composer: string;
    opus?: string;
    no?: string;
    catalogPrefix?: string;
    catalogNumber?: string;
    albumId: string;
    workTitle?: string;
}

/**
 * Returns a shuffled copy of an array using the Fisher-Yates algorithm.
 */
export function shuffle<T>(array: T[], mutate: boolean = false): T[] {
    const shuffled: T[] = mutate ? array : [...array];

    for (let i = shuffled.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

/**
 * Partitions a track list by classical work/piece (if applicable), then shuffles
 * while keeping partitions intact and sorted.
 */
export function classicalShuffle(tracks: PlaylistItem[]) {
    const partitions: PlaylistPartition[] = classicalPartition(tracks);
    const shuffledPartitions: PlaylistPartition[] = shuffle(partitions, true);
    const shuffledTracks: PlaylistItem[] = [];

    for (const p of shuffledPartitions) {
        // Sort by track number in album
        p.items.sort((a, b) => a.item.track_number - b.item.track_number);

        // Combine all partition items into an array
        p.items.forEach(track => {
            shuffledTracks.push(track);
        });
    }

    return shuffledTracks;
}

/**
 * Partitions a track list by classical work/piece.
 */
export function classicalPartition(tracks: PlaylistItem[]): PlaylistPartition[] {
    const partitions: PlaylistPartition[] = [];

    for (const track of tracks) {
        const trackDiscriminators: PartitionDiscriminators = {
            albumId: track.item.album.id,
            primaryArtistName: track.item.artists[0].name,
            trackNumber: track.item.track_number,
            name: track.item.name,
        };
        let foundPartition: boolean = false;

        for (const p of partitions) {
            if (classicallyEquivalent(trackDiscriminators, p.discriminators)) {
                p.items.push(track);
                foundPartition = true;
                break;
            }
        }

        if (!foundPartition) {
            partitions.push({
                discriminators: trackDiscriminators,
                items: [track],
            });
        }
    }

    return partitions;
}

function classicallyEquivalent(a: PartitionDiscriminators, b: PartitionDiscriminators): boolean {
    const getClassicalHeuristics = (track: PartitionDiscriminators): ClassicalHeuristics => {
        const nameSplits = track.name.split(":");
        const catalogRegexMatches = track.name.match(catalogRegex);

        return {
            albumId: track.albumId,
            opus: track.name.match(opusRegex)?.[1],
            no: track.name.match(noRegex)?.[1],
            catalogPrefix: catalogRegexMatches?.[1],
            catalogNumber: catalogRegexMatches?.[2],
            composer: track.primaryArtistName,
            workTitle: nameSplits.length > 1 ? nameSplits[0] : undefined,
        };
    };

    const chA = getClassicalHeuristics(a);
    const chB = getClassicalHeuristics(b);

    if (chA.composer !== chB.composer) return false;
    if (chA.opus && chB.opus && chA.opus !== chB.opus) return false;
    if (chA.no && chB.no && chA.no !== chB.no) return false;
    if (chA.catalogPrefix && chB.catalogPrefix && chA.catalogPrefix !== chB.catalogPrefix) return false;
    if (chA.catalogNumber && chB.catalogNumber && chA.catalogNumber !== chB.catalogNumber) return false;

    if (chA.workTitle && chB.workTitle) {
        return chA.workTitle === chB.workTitle;
    }

    // Fallback: the composer is the same, but we have lots of missing metadata
    // e.g. tracks with movement-only titles
    return chA.albumId === chB.albumId;
}