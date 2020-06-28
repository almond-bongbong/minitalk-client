import React, { ComponentType, ReactElement, Suspense } from 'react';
import { View, ActivityIndicator } from 'react-native';

const SuspenseLoader = (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator />
  </View>
)

function withSuspense(Component: ComponentType) {
    return () => (
      <Suspense fallback={SuspenseLoader}>
        <Component />
      </Suspense>
    );
}

export default withSuspense;
