import ProvidersLoaded from 'providers/providers-loaded';
import ProvidersSupported from 'providers/providers-supported';
import DefaultProvider from 'providers/default';
import _ from 'utils/underscore';

export default function registerProvider(provider) {
    var name = provider.getName().name;

    // Only register the provider if it isn't registered already.  This is an issue on pages with multiple embeds.
    if (ProvidersLoaded[name]) {
        return;
    }

    // If there isn't a "supports" val for this guy
    if (!_.find(ProvidersSupported, _.matches({ name: name }))) {
        if (!_.isFunction(provider.supports)) {
            throw new Error('Tried to register a provider with an invalid object');
        }

        // The most recent provider will be in the front of the array, and chosen first
        ProvidersSupported.unshift({
            name: name,
            supports: provider.supports
        });
    }

    // Fill in any missing properties with the defaults - looks at the prototype chain
    _.defaults(provider.prototype, DefaultProvider);

    // After registration, it is loaded
    ProvidersLoaded[name] = provider;
}
