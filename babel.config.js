const path = require('node:path');

// RN CLI does not provide shell environment values to the device runtime.
// Only these existing, public API URL settings belong in this module's bundle.
const publicApiEnvironment = Object.fromEntries([
  'EXPO_PUBLIC_API_BASE_URL',
  'EXPO_PUBLIC_PIECE_API_URL',
  'EXPO_PUBLIC_ANALYSIS_API_URL',
  'EXPO_PUBLIC_MYMODEL_API_URL',
].map(key => [key, process.env[key] || '']));
const apiResolverFile = path.resolve(__dirname, 'lib/compat/legacyWireContracts.js');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    function inlinePublicApiEnvironment({types}) {
      return {
        visitor: {
          Program(program, state) {
            if (state.filename !== apiResolverFile) return;
            // Complete this substitution before the RN preset lowers the chain.
            program.traverse({
              OptionalMemberExpression(member) {
                if (member.node.computed ||
                    !types.isIdentifier(member.node.object, {name: 'process'}) ||
                    !types.isIdentifier(member.node.property, {name: 'env'}) ||
                    member.scope.hasBinding('process')) return;
                member.replaceWith(types.valueToNode(publicApiEnvironment));
              },
            });
          },
        },
      };
    },
    'react-native-reanimated/plugin',
  ],
};
